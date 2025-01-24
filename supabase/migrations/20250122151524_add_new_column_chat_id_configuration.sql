ALTER TABLE configuration
ADD COLUMN chat_id UUID REFERENCES chats(id);