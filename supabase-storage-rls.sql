-- This SQL script sets up Row Level Security (RLS) policies for the Supabase storage bucket
-- Run this in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- First, ensure the bucket exists (this is also handled in our code, but good to have here too)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
USING (
  -- Extract the user ID from the path (first segment)
  -- The path format is: {userId}/{filename}
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy that allows users to upload their own files
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  -- Extract the user ID from the path (first segment)
  -- The path format is: {userId}/{filename}
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy that allows users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
USING (
  -- Extract the user ID from the path (first segment)
  -- The path format is: {userId}/{filename}
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy that allows users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
USING (
  -- Extract the user ID from the path (first segment)
  -- The path format is: {userId}/{filename}
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a policy that allows service role to access all files
-- This is necessary for server-side operations
CREATE POLICY "Service role can access all files"
ON storage.objects
FOR ALL
USING (
  auth.role() = 'service_role'
);

-- Create a policy that allows authenticated users to read all public files
-- Uncomment this if you want to allow public file access
-- CREATE POLICY "Authenticated users can read all public files"
-- ON storage.objects
-- FOR SELECT
-- USING (
--   bucket_id = 'public'
-- ); 