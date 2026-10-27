-- Refuse incompatible existing records rather than changing their publication state.
DO $$
DECLARE invalid_id uuid;
BEGIN
    SELECT id INTO invalid_id FROM cars
    WHERE status IN ('published', 'hidden') AND NOT (
        country_id IS NOT NULL AND year IS NOT NULL AND price IS NOT NULL
        AND length(trim(brand)) > 0 AND length(trim(model)) > 0
        AND length(trim(category)) > 0 AND cardinality(images) BETWEEN 1 AND 30
        AND jsonb_typeof(specs) = 'object'
        AND specs ?& ARRAY['mileage','engineVolume','horsePower','fuelType','transmission','driveType']
        AND jsonb_typeof(specs->'mileage') = 'number'
        AND jsonb_typeof(specs->'engineVolume') = 'number'
        AND jsonb_typeof(specs->'horsePower') = 'number'
        AND jsonb_typeof(specs->'fuelType') = 'string' AND length(trim(specs->>'fuelType')) > 0
        AND jsonb_typeof(specs->'transmission') = 'string' AND length(trim(specs->>'transmission')) > 0
        AND jsonb_typeof(specs->'driveType') = 'string' AND length(trim(specs->>'driveType')) > 0
    ) IS TRUE LIMIT 1;
    IF invalid_id IS NOT NULL THEN
        RAISE EXCEPTION 'Incomplete published/hidden car %, repair before migration', invalid_id;
    END IF;
END $$;

ALTER TABLE cars
    ALTER COLUMN country_id DROP NOT NULL,
    ALTER COLUMN year DROP NOT NULL,
    ALTER COLUMN price DROP NOT NULL,
    ALTER COLUMN category SET DEFAULT '',
    ALTER COLUMN specs SET DEFAULT '{}',
    ADD CONSTRAINT cars_specs_object CHECK (jsonb_typeof(specs) = 'object'),
    ADD CONSTRAINT cars_images_limit CHECK (cardinality(images) <= 30),
    ADD CONSTRAINT cars_complete_publication CHECK (status = 'draft' OR (
        country_id IS NOT NULL AND year IS NOT NULL AND price IS NOT NULL
        AND length(trim(brand)) > 0 AND length(trim(model)) > 0
        AND length(trim(category)) > 0 AND cardinality(images) >= 1
        AND specs ?& ARRAY['mileage','engineVolume','horsePower','fuelType','transmission','driveType']
        AND jsonb_typeof(specs->'mileage') = 'number'
        AND jsonb_typeof(specs->'engineVolume') = 'number'
        AND jsonb_typeof(specs->'horsePower') = 'number'
        AND jsonb_typeof(specs->'fuelType') = 'string' AND length(trim(specs->>'fuelType')) > 0
        AND jsonb_typeof(specs->'transmission') = 'string' AND length(trim(specs->>'transmission')) > 0
        AND jsonb_typeof(specs->'driveType') = 'string' AND length(trim(specs->>'driveType')) > 0
    ) IS TRUE);
CREATE INDEX cars_updated_idx ON cars(updated_at DESC, id DESC);
