-- Step 1: Create ENUM type (only if it does not exist)
CREATE TYPE flow_state AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUCCESS', 'FAILED');
CREATE TYPE command_stage AS ENUM ('explore', 'migrate', 'codepush', 'deploy', 'search', 'cleanup');

-- Step 2: Create table using ENUM type
CREATE TABLE IF NOT EXISTS chat_flow (
    id SERIAL PRIMARY KEY,
    chat_id UUID NOT NULL,
    metadata JSONB,            
    command_stage command_stage NOT NULL,
    flow_state flow_state NOT NULL DEFAULT 'NOT_STARTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(chat_id, command_stage)
);

-- Create indexes for common query patterns
CREATE INDEX idx_chat_flow_chat_id_created_at ON chat_flow (chat_id, created_at);
