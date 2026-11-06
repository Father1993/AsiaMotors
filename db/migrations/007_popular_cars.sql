ALTER TABLE cars ADD COLUMN featured_position integer;
ALTER TABLE cars ADD CONSTRAINT cars_featured_position_range CHECK (featured_position BETWEEN 1 AND 12);
CREATE UNIQUE INDEX cars_featured_position_idx ON cars (featured_position)
    WHERE featured_position IS NOT NULL;
