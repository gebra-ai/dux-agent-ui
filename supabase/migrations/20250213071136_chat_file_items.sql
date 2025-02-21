-- Create the chat_file_items table
CREATE TABLE IF NOT EXISTS chat_file_items (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- REQUIRED RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_item_id UUID NOT NULL REFERENCES file_items(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp for creation
    updated_at TIMESTAMPTZ -- Timestamp for last update (No trailing comma here)
);

-- Enable RLS
ALTER TABLE chat_file_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow access to own chat_file_items
CREATE POLICY "Allow full access to own chat_file_items"
ON chat_file_items
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index on user_id for faster query performance
CREATE INDEX IF NOT EXISTS idx_chat_file_items_user_id
ON chat_file_items (user_id);

-- Optionally, create index on created_at and updated_at
CREATE INDEX IF NOT EXISTS idx_chat_file_items_created_at
ON chat_file_items (created_at);

CREATE INDEX IF NOT EXISTS idx_chat_file_items_updated_at
ON chat_file_items (updated_at);
