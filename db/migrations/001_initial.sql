CREATE TABLE IF NOT EXISTS countries (
    id text PRIMARY KEY CHECK (id IN ('china','japan','korea','europe')),
    name text NOT NULL
);
INSERT INTO countries VALUES ('china','Китай'),('japan','Япония'),('korea','Корея'),('europe','Европа') ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS cars (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id text NOT NULL REFERENCES countries(id),
    brand text NOT NULL, model text NOT NULL,
    year integer NOT NULL CHECK (year BETWEEN 1900 AND 2200),
    category text NOT NULL, price double precision NOT NULL CHECK (price >= 0 AND price < 1e12),
    equipment text NOT NULL DEFAULT '',
    images text[] NOT NULL DEFAULT '{}', specs jsonb NOT NULL,
    available boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS media (
    filename text PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    request_key uuid NOT NULL UNIQUE,
    payload jsonb NOT NULL,
    consent_version text NOT NULL,
    consent_at timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','processing','closed')),
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mail_outbox (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
    attempts integer NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
    next_attempt_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz, last_error text
);
CREATE INDEX IF NOT EXISTS mail_pending_idx ON mail_outbox(next_attempt_at) WHERE status='pending';
CREATE TABLE IF NOT EXISTS request_limits (
    key text PRIMARY KEY, window_start timestamptz NOT NULL, hits integer NOT NULL
);
