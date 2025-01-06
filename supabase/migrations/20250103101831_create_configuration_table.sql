CREATE TABLE IF NOT EXISTS configuration (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- REQUIRED RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- OPTIONAL RELATIONSHIPS
    -- You can add more relationships like folder_id if needed in the future

    -- METADATA
    meta JSONB NOT NULL, -- Store metadata as JSONB
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp for creation
    updated_at TIMESTAMPTZ, -- Timestamp for last update


    -- REQUIRED FIELDS
    type TEXT NOT NULL CHECK (char_length(type) <= 100) -- Type of the configuration, up to 100 characters
);


-- Enable RLS
ALTER TABLE configuration ENABLE ROW LEVEL SECURITY;

-- Create policy to allow access to own configurations
CREATE POLICY "Allow full access to own configurations"
ON configuration
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index on user_id for faster query performance
CREATE INDEX idx_configuration_user_id
ON configuration (user_id);

-- Optionally, create index on created_at and updated_at
CREATE INDEX idx_configuration_created_at
ON configuration (created_at);

CREATE INDEX idx_configuration_updated_at
ON configuration (updated_at);
