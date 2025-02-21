CREATE TABLE IF NOT EXISTS chat_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    attribute VARCHAR NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp for creation
    updated_at TIMESTAMPTZ, -- Timestamp for last update
    CONSTRAINT unique_chat_user_attribute UNIQUE (chat_id, user_id, attribute)
);

-- Enable RLS
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow access to own chat_settings
CREATE POLICY "Allow full access to own chat_settings"
ON chat_settings
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index on user_id for faster query performance
CREATE INDEX idx_chat_settings_user_id
ON chat_settings (user_id);

-- Optionally, create index on created_at and updated_at
CREATE INDEX idx_chat_settings_created_at
ON chat_settings (created_at);

CREATE INDEX idx_chat_settings_updated_at
ON chat_settings (updated_at);
