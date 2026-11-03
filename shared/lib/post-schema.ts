import { z } from "zod";

export type DocumentMark = {
  type: "bold" | "italic" | "link";
  attrs?: {
    href: string;
    target?: string | null;
    rel?: string | null;
    class?: null;
  };
};
export type DocumentNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: DocumentMark[];
  content?: DocumentNode[];
};
export function safePostLink(value: string) {
  if (/[\\\u0000-\u0020]/.test(value)) return false;
  return (
    /^https?:\/\//i.test(value) ||
    /^\/(?!\/)/.test(value) ||
    /^#[a-z0-9-]+$/i.test(value)
  );
}
const mediaUrl = z.string().regex(/^\/media\/[0-9a-f-]{36}\.webp$/);
const allowed = new Set([
  "doc",
  "paragraph",
  "heading",
  "text",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "hardBreak",
  "image",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
]);
export const nodeSchema = z.unknown().transform((input, ctx): DocumentNode => {
  let count = 0;
  function invalid(): never {
    throw Error("Недопустимое содержимое статьи");
  }
  function visit(value: unknown, depth: number): DocumentNode {
    if (
      ++count > 10000 ||
      depth > 20 ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    )
      return invalid();
    const n = value as Record<string, unknown>;
    if (
      Object.keys(n).some(
        (k) => !["type", "attrs", "text", "marks", "content"].includes(k),
      ) ||
      typeof n.type !== "string" ||
      !allowed.has(n.type)
    )
      return invalid();
    const attrs = n.attrs as Record<string, unknown> | undefined;
    if (
      n.attrs !== undefined &&
      (attrs === null || typeof attrs !== "object" || Array.isArray(attrs))
    )
      return invalid();
    const keys =
      n.type === "heading"
        ? ["level"]
        : n.type === "image"
          ? ["src", "alt", "title", "caption"]
          : n.type === "orderedList"
            ? ["start", "type"]
            : ["tableCell", "tableHeader"].includes(n.type)
              ? ["colspan", "rowspan", "colwidth", "align"]
              : [];
    if (attrs && Object.keys(attrs).some((k) => !keys.includes(k)))
      return invalid();
    if (n.type === "heading" && ![2, 3].includes(attrs?.level as number))
      return invalid();
    if (
      n.type === "image" &&
      (!mediaUrl.safeParse(attrs?.src).success ||
        typeof attrs?.alt !== "string" ||
        String(attrs.alt).length > 500 ||
        (attrs.title != null &&
          (typeof attrs.title !== "string" || attrs.title.length > 500)))
    )
      return invalid();
    if (
      n.type === "image" &&
      attrs?.caption != null &&
      (typeof attrs.caption !== "string" || attrs.caption.length > 1000)
    )
      return invalid();
    if (
      n.type === "orderedList" &&
      attrs?.type != null &&
      (typeof attrs.type !== "string" ||
        !["1", "a", "A", "i", "I"].includes(attrs.type))
    )
      return invalid();
    if (
      n.type === "orderedList" &&
      attrs?.start !== undefined &&
      (!Number.isInteger(attrs.start) ||
        Number(attrs.start) < 1 ||
        Number(attrs.start) > 10000)
    )
      return invalid();
    if (["tableCell", "tableHeader"].includes(n.type) && attrs) {
      for (const key of ["colspan", "rowspan"])
        if (
          attrs[key] !== undefined &&
          (!Number.isInteger(attrs[key]) ||
            Number(attrs[key]) < 1 ||
            Number(attrs[key]) > 20)
        )
          return invalid();
      if (
        attrs.colwidth != null &&
        (!Array.isArray(attrs.colwidth) ||
          attrs.colwidth.length > 20 ||
          attrs.colwidth.some((v) => !Number.isInteger(v) || v < 1 || v > 4000))
      )
        return invalid();
      if (
        attrs.align != null &&
        (typeof attrs.align !== "string" ||
          !["left", "right", "center"].includes(attrs.align))
      )
        return invalid();
    }
    if (
      n.text !== undefined &&
      (n.type !== "text" ||
        typeof n.text !== "string" ||
        n.text.length === 0 ||
        n.text.length > 200000)
    )
      return invalid();
    if (n.type === "text" && typeof n.text !== "string") return invalid();
    let marks: DocumentMark[] | undefined;
    if (n.marks !== undefined) {
      if (n.type !== "text" || !Array.isArray(n.marks) || n.marks.length > 4)
        return invalid();
      if (new Set(n.marks.map((m) => m?.type)).size !== n.marks.length)
        return invalid();
      marks = n.marks.map((m: DocumentMark) => {
        if (
          !m ||
          !["bold", "italic", "link"].includes(m.type) ||
          Object.keys(m).some((k) => !["type", "attrs"].includes(k))
        )
          return invalid();
        if (m.type === "link") {
          if (
            !m.attrs ||
            typeof m.attrs.href !== "string" ||
            m.attrs.href.length > 2048 ||
            !safePostLink(m.attrs.href)
          )
            return invalid();
          return { type: "link" as const, attrs: { href: m.attrs.href } };
        }
        if (m.attrs && Object.keys(m.attrs).length) return invalid();
        return { type: m.type };
      });
    }
    if (n.content !== undefined && !Array.isArray(n.content)) return invalid();
    if (
      ["text", "image", "hardBreak"].includes(n.type) &&
      n.content !== undefined
    )
      return invalid();
    const content = (n.content as unknown[] | undefined)?.map((v) =>
      visit(v, depth + 1),
    );
    const blocks = [
      "paragraph",
      "heading",
      "bulletList",
      "orderedList",
      "blockquote",
      "image",
      "table",
    ];
    const children: Record<string, string[]> = {
      doc: blocks,
      paragraph: ["text", "hardBreak"],
      heading: ["text", "hardBreak"],
      bulletList: ["listItem"],
      orderedList: ["listItem"],
      listItem: blocks,
      blockquote: blocks,
      table: ["tableRow"],
      tableRow: ["tableCell", "tableHeader"],
      tableCell: blocks,
      tableHeader: blocks,
    };
    if (content?.some((c) => !children[n.type as string]?.includes(c.type)))
      return invalid();
    // Match the editor's ProseMirror content expressions, not just node names.
    const nonempty = [
      "doc",
      "bulletList",
      "orderedList",
      "listItem",
      "blockquote",
      "table",
      "tableRow",
      "tableCell",
      "tableHeader",
    ];
    if (nonempty.includes(n.type) && !content?.length) return invalid();
    if (n.type === "listItem" && content?.[0]?.type !== "paragraph")
      return invalid();
    return {
      type: n.type,
      ...(attrs ? { attrs } : {}),
      ...(n.text !== undefined ? { text: n.text as string } : {}),
      ...(marks ? { marks } : {}),
      ...(content ? { content } : {}),
    };
  }
  try {
    const node = visit(input, 0);
    if (node.type !== "doc") invalid();
    return node;
  } catch {
    ctx.addIssue({
      code: "custom",
      message: "Недопустимое содержимое или превышен размер документа",
    });
    return z.NEVER;
  }
});
export const documentSchema = z
  .object({
    title: z.string().trim().min(1, "Укажите заголовок").max(250),
    excerpt: z.string().trim().max(1000).default(""),
    author: z.string().trim().max(150).default(""),
    cover: z.union([z.literal(""), mediaUrl]).default(""),
    coverAlt: z.string().trim().max(500).default(""),
    tags: z.array(z.string().trim().min(1).max(60)).max(10).default([]),
    seoTitle: z.string().trim().max(250).default(""),
    seoDescription: z.string().trim().max(1000).default(""),
    showCta: z.boolean().default(true),
    content: nodeSchema,
  })
  .strict();
export type PostDocument = z.infer<typeof documentSchema>;
export function documentText(node: DocumentNode): string {
  return [node.text || "", ...(node.content || []).map(documentText)].join(" ");
}
export function mediaFilenames(document: PostDocument) {
  const files = new Set<string>();
  if (document.cover) files.add(document.cover.slice(7));
  function visit(n: DocumentNode) {
    if (n.type === "image") files.add(String(n.attrs?.src).slice(7));
    n.content?.forEach(visit);
  }
  visit(document.content);
  return [...files].sort();
}
export function validatePublication(document: PostDocument) {
  return documentSchema
    .superRefine((d, ctx) => {
      for (const field of ["excerpt", "author", "cover", "coverAlt"] as const)
        if (!d[field])
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: "Заполните поле перед публикацией",
          });
      if (documentText(d.content).trim().length < 50)
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "Добавьте текст статьи (не менее 50 символов)",
        });
    })
    .parse(document);
}
