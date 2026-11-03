import "server-only";
import { z } from "zod";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { database } from "./db";
import { HttpError } from "./http";
import {
  documentSchema,
  mediaFilenames,
  validatePublication,
  type PostDocument,
} from "../post-schema";
import type { PoolClient } from "pg";
export type AdminPost = {
  id: string;
  slug: string;
  status: "draft" | "published" | "hidden";
  version: number;
  draft: PostDocument;
  published: PostDocument | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  publication_updated_at: string | null;
  hasChanges: boolean;
};
function serialize(row: Record<string, unknown>): AdminPost {
  return JSON.parse(
    JSON.stringify({
      ...row,
      hasChanges: JSON.stringify(row.draft) !== JSON.stringify(row.published),
    }),
  );
}
const versionSchema = z.number().int().positive();
const conflict = () =>
  new HttpError(
    409,
    "Статья уже изменена. Откройте актуальную версию отдельно; ваш ввод сохранён.",
  );
export async function getAdminPost(id: string): Promise<AdminPost> {
  z.uuid().parse(id);
  const { rows } = await database().query("SELECT * FROM posts WHERE id=$1", [
    id,
  ]);
  if (!rows[0]) throw new HttpError(404, "Статья не найдена");
  return serialize(rows[0]);
}
export async function listAdminPosts(params: URLSearchParams) {
  const p = z
    .object({
      q: z.string().trim().max(150).default(""),
      status: z.enum(["draft", "published", "hidden"]).optional(),
      page: z.coerce.number().int().min(1).max(1000000).default(1),
    })
    .parse(Object.fromEntries(params));
  const { rows } = await database().query(
    `WITH filtered AS (SELECT * FROM posts WHERE ($1='' OR draft->>'title' ILIKE $2) AND ($3::text IS NULL OR status=$3)) SELECT (SELECT count(*)::int FROM filtered) total,COALESCE((SELECT jsonb_agg(p) FROM (SELECT * FROM filtered ORDER BY updated_at DESC,id DESC LIMIT 20 OFFSET $4)p),'[]'::jsonb) posts`,
    [
      p.q,
      "%" + p.q.replace(/[\\%_]/g, "\\$&") + "%",
      p.status ?? null,
      (p.page - 1) * 20,
    ],
  );
  return {
    ...rows[0],
    posts: rows[0].posts.map(serialize),
    page: p.page,
    pageSize: 20,
  };
}
async function checkSlug(slug: string) {
  const names = await readdir(path.join(process.cwd(), "public", "posts"));
  if (
    slug &&
    names.some(
      (n) =>
        n.endsWith(".mdx") &&
        n.slice(0, -4).toLowerCase() === slug.toLowerCase(),
    )
  )
    throw new HttpError(409, "Адрес занят архивной статьёй", {
      slug: ["Выберите другой адрес"],
    });
}
async function references(
  c: PoolClient,
  id: string,
  draft: PostDocument,
  published: PostDocument | null,
) {
  const files = [
    ...new Set([
      ...mediaFilenames(draft),
      ...(published ? mediaFilenames(published) : []),
    ]),
  ].sort();
  const found = await c.query(
    "SELECT filename FROM media WHERE filename=ANY($1::text[]) ORDER BY filename FOR UPDATE",
    [files],
  );
  if (found.rowCount !== files.length)
    throw new HttpError(400, "Изображение не найдено. Загрузите его заново.", {
      cover: ["Проверьте изображения статьи"],
    });
  await c.query("DELETE FROM post_media WHERE post_id=$1", [id]);
  if (files.length)
    await c.query(
      "INSERT INTO post_media(post_id,filename) SELECT $1,unnest($2::text[])",
      [id, files],
    );
}
export async function savePost(
  input: unknown,
  id?: string,
): Promise<AdminPost> {
  const data = z
    .object({
      id: z.uuid().optional(),
      version: versionSchema.optional(),
      slug: z
        .string()
        .max(180)
        .regex(
          /^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Используйте латиницу, цифры и дефисы",
        ),
      document: documentSchema,
    })
    .strict()
    .parse(input);
  const identifier = id ? z.uuid().parse(id) : z.uuid().parse(data.id);
  if (id) versionSchema.parse(data.version);
  await checkSlug(data.slug);
  const c = await database().connect();
  try {
    await c.query("BEGIN");
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
      identifier,
    ]);
    const old = (
      await c.query("SELECT * FROM posts WHERE id=$1 FOR UPDATE", [identifier])
    ).rows[0];
    if (!id && old) {
      await c.query("COMMIT");
      return serialize(old);
    }
    if (id && !old) throw new HttpError(404, "Статья не найдена");
    if (id && old.version !== data.version) throw conflict();
    if (old?.published_at && data.slug !== old.slug)
      throw new HttpError(409, "Адрес после публикации изменить нельзя", {
        slug: ["Адрес зафиксирован"],
      });
    const row = old
      ? (
          await c.query(
            "UPDATE posts SET slug=$2,draft=$3,version=version+1,updated_at=now() WHERE id=$1 RETURNING *",
            [identifier, data.slug, JSON.stringify(data.document)],
          )
        ).rows[0]
      : (
          await c.query(
            "INSERT INTO posts(id,slug,draft) VALUES($1,$2,$3) RETURNING *",
            [identifier, data.slug, JSON.stringify(data.document)],
          )
        ).rows[0];
    await references(c, identifier, data.document, row.published);
    await c.query("COMMIT");
    return serialize(row);
  } catch (e) {
    await c.query("ROLLBACK");
    if ((e as { code?: string }).code === "23505")
      throw new HttpError(409, "Этот адрес уже занят", {
        slug: ["Выберите другой адрес"],
      });
    throw e;
  } finally {
    c.release();
  }
}
export async function changePostStatus(
  id: string,
  input: unknown,
): Promise<AdminPost> {
  z.uuid().parse(id);
  const { version, action } = z
    .object({
      version: versionSchema,
      action: z.enum(["publish", "hide", "restore"]),
    })
    .strict()
    .parse(input);
  const c = await database().connect();
  try {
    await c.query("BEGIN");
    const row = (
      await c.query("SELECT * FROM posts WHERE id=$1 FOR UPDATE", [id])
    ).rows[0];
    if (!row) throw new HttpError(404, "Статья не найдена");
    if (row.version !== version) throw conflict();
    if (action === "publish") {
      if (!row.slug)
        throw new HttpError(400, "Укажите адрес статьи", {
          slug: ["Заполните адрес"],
        });
      await checkSlug(row.slug);
      validatePublication(row.draft);
      await references(c, id, row.draft, row.draft);
      await c.query(
        "UPDATE posts SET status='published',published=draft,published_at=COALESCE(published_at,now()),publication_updated_at=now(),version=version+1,updated_at=now() WHERE id=$1",
        [id],
      );
    } else {
      if (
        !row.published ||
        (action === "hide" && row.status !== "published") ||
        (action === "restore" && row.status !== "hidden")
      )
        throw new HttpError(409, "Действие недоступно для состояния статьи");
      await c.query(
        "UPDATE posts SET status=$2,version=version+1,updated_at=now() WHERE id=$1",
        [id, action === "hide" ? "hidden" : "published"],
      );
    }
    const result = (await c.query("SELECT * FROM posts WHERE id=$1", [id]))
      .rows[0];
    await c.query("COMMIT");
    return serialize(result);
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}
export async function deletePost(id: string, input: unknown) {
  z.uuid().parse(id);
  const { version } = z
    .object({ version: versionSchema })
    .strict()
    .parse(input);
  const result = await database().query(
    "DELETE FROM posts WHERE id=$1 AND version=$2 AND published_at IS NULL RETURNING id",
    [id, version],
  );
  if (!result.rowCount) {
    const current = await getAdminPost(id);
    if (current.published_at)
      throw new HttpError(409, "Опубликованную статью можно только скрыть");
    throw conflict();
  }
  return { ok: true };
}
const publicSelection =
  "id,slug,status,version,published AS draft,published,created_at,publication_updated_at AS updated_at,published_at,publication_updated_at";
export async function getPublishedPosts(): Promise<AdminPost[]> {
  const { rows } = await database().query(
    `SELECT ${publicSelection} FROM posts WHERE status='published' ORDER BY published_at DESC,id DESC`,
  );
  return rows.map(serialize);
}
export async function getPublishedPost(
  slug: string,
): Promise<AdminPost | null> {
  const { rows } = await database().query(
    `SELECT ${publicSelection} FROM posts WHERE status='published' AND slug=$1`,
    [slug],
  );
  return rows[0] ? serialize(rows[0]) : null;
}

export type BlogAdminItem = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
  status: "draft" | "published" | "hidden";
  hasChanges: boolean;
  source: "new" | "archive";
  missingImages: string[];
};
export async function listBlogAdminItems(params: URLSearchParams) {
  const filters = z
    .object({
      q: z.string().trim().max(150).default(""),
      status: z.enum(["draft", "published", "hidden"]).optional(),
      source: z.enum(["all", "new", "archive"]).default("all"),
      page: z.coerce.number().int().min(1).max(1000000).default(1),
    })
    .parse(
      Object.fromEntries(
        [...params].filter(
          ([key, value]) =>
            value !== "" || !["status", "source", "page"].includes(key),
        ),
      ),
    );
  const { adminBlogPosts } = await import("./admin-blog");
  const archive: BlogAdminItem[] = (await adminBlogPosts()).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    date: post.date,
    author: post.author,
    tags: post.tags || [],
    status: "published",
    hasChanges: false,
    source: "archive",
    missingImages: post.missingImages,
  }));
  const { rows } = await database().query(
    `
    WITH items AS (
      SELECT jsonb_build_object('id',id,'slug',slug,'title',draft->>'title',
        'excerpt',draft->>'excerpt','image',draft->>'cover','date',updated_at,
        'author',draft->>'author','tags',draft->'tags','status',status,
        'hasChanges',draft IS DISTINCT FROM published,'source','new','missingImages','[]'::jsonb) item,
        updated_at sort_date FROM posts
      UNION ALL SELECT item,(item->>'date')::timestamptz sort_date
        FROM jsonb_array_elements($1::jsonb) item
    ), filtered AS (
      SELECT * FROM items WHERE ($2='' OR concat_ws(' ',item->>'title',item->>'excerpt',item->>'author',item->>'tags') ILIKE $3)
        AND ($4::text IS NULL OR item->>'status'=$4)
        AND ($5='all' OR item->>'source'=$5)
    ) SELECT (SELECT count(*)::int FROM filtered) total,
      COALESCE((SELECT jsonb_agg(item) FROM (SELECT item FROM filtered
        ORDER BY sort_date DESC,item->>'slug' LIMIT 20 OFFSET LEAST($6,GREATEST(0,(SELECT count(*) FROM filtered)-1)/20*20)) p),'[]'::jsonb) posts`,
    [
      JSON.stringify(archive),
      filters.q,
      "%" + filters.q.replace(/[\\%_]/g, "\\$&") + "%",
      filters.status ?? null,
      filters.source,
      (filters.page - 1) * 20,
    ],
  );
  return {
    posts: rows[0].posts as BlogAdminItem[],
    total: rows[0].total as number,
    page: Math.min(filters.page, Math.max(1, Math.ceil(rows[0].total / 20))),
    pageSize: 20,
  };
}
