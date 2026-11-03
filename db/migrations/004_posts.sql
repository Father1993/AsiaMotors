CREATE TABLE posts (
 id uuid PRIMARY KEY,
 slug text NOT NULL CHECK (slug = '' OR slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','hidden')),
 version integer NOT NULL DEFAULT 1 CHECK(version > 0),
 draft jsonb NOT NULL CHECK(jsonb_typeof(draft)='object'),
 published jsonb CHECK(published IS NULL OR jsonb_typeof(published)='object'),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 published_at timestamptz, publication_updated_at timestamptz,
 CHECK(status='draft' OR (published IS NOT NULL AND published_at IS NOT NULL AND slug<>''))
);
CREATE UNIQUE INDEX posts_slug_unique ON posts(lower(slug)) WHERE slug<>'';
CREATE INDEX posts_listing_idx ON posts(status,updated_at DESC,id DESC);
CREATE TABLE post_media (
 post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
 filename text NOT NULL REFERENCES media(filename), PRIMARY KEY(post_id,filename)
);
CREATE INDEX post_media_filename_idx ON post_media(filename);
