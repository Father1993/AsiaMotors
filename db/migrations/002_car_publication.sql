-- Backfill the existing catalog before changing the default for new records.
ALTER TABLE cars
    ADD COLUMN status text NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft', 'published', 'hidden')),
    ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);

ALTER TABLE cars ALTER COLUMN status SET DEFAULT 'draft';

CREATE INDEX cars_status_updated_idx ON cars(status, updated_at DESC, id);
