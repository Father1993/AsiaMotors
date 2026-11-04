ALTER TABLE posts
 ADD COLUMN scheduled_at timestamptz,
 ADD COLUMN scheduled_document jsonb,
 ADD CONSTRAINT posts_schedule_snapshot CHECK (
   (scheduled_at IS NULL AND scheduled_document IS NULL) OR
   (scheduled_at IS NOT NULL AND scheduled_document IS NOT NULL AND jsonb_typeof(scheduled_document)='object' AND slug<>'')
 );
CREATE INDEX posts_due_idx ON posts(scheduled_at) WHERE scheduled_at IS NOT NULL;
