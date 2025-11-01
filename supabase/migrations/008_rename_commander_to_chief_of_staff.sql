-- Rename Commander to Chief of Staff in canonical agents table
UPDATE agents
SET name = 'Chief of Staff'
WHERE name = 'Commander' OR lower(name) = 'commander';

-- If display_name or title columns exist, keep them in sync
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'display_name'
  ) THEN
    UPDATE agents
    SET display_name = 'Chief of Staff'
    WHERE display_name = 'Commander' OR lower(display_name) = 'commander';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'title'
  ) THEN
    UPDATE agents
    SET title = 'Chief of Staff'
    WHERE title = 'Commander' OR lower(title) = 'commander';
  END IF;
END;
$$;
