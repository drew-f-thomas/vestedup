-- Migration script to add isEncrypted field to documents table
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- First, check if the column already exists to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'documents'
        AND column_name = 'is_encrypted'
    ) THEN
        -- Add the is_encrypted column with a default value of false
        ALTER TABLE documents
        ADD COLUMN is_encrypted BOOLEAN NOT NULL DEFAULT false;
        
        -- Add a comment to the column for documentation
        COMMENT ON COLUMN documents.is_encrypted IS 'Indicates whether the document is encrypted with AWS KMS';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position; 