BEGIN;

-- Create temporary columns
ALTER TABLE chat_flow ADD COLUMN command_stage_new TEXT;
ALTER TABLE chat_flow ADD COLUMN flow_state_new TEXT;

-- Copy data to new columns
UPDATE chat_flow SET 
    command_stage_new = command_stage::TEXT,
    flow_state_new = flow_state::TEXT;

-- Drop old columns
ALTER TABLE chat_flow DROP COLUMN command_stage;
ALTER TABLE chat_flow DROP COLUMN flow_state;

-- Rename new columns to original names
ALTER TABLE chat_flow RENAME COLUMN command_stage_new TO command_stage;
ALTER TABLE chat_flow RENAME COLUMN flow_state_new TO flow_state;

-- Add NOT NULL constraints
ALTER TABLE chat_flow ALTER COLUMN command_stage SET NOT NULL;
ALTER TABLE chat_flow ALTER COLUMN flow_state SET NOT NULL;

-- Set default for flow_state
ALTER TABLE chat_flow ALTER COLUMN flow_state SET DEFAULT 'NOT_STARTED';

-- Drop enum types
DROP TYPE IF EXISTS flow_state;
DROP TYPE IF EXISTS command_stage;

COMMIT;
