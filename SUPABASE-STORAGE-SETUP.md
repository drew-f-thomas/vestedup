# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for document uploads in the VestedUp application.

## Prerequisites

- A Supabase project
- Admin access to your Supabase project
- The Supabase URL and service role key

## Step 1: Create the Storage Bucket

The application will attempt to create the storage bucket automatically when it starts up. However, you can also create it manually:

1. Go to your Supabase dashboard
2. Navigate to the "Storage" section
3. Click "Create a new bucket"
4. Name it "documents"
5. Set it to "Private" (not public)

## Step 2: Set Up Row Level Security (RLS) Policies

To ensure proper security, you need to set up Row Level Security (RLS) policies for your storage bucket. These policies control who can access, upload, update, and delete files.

1. Go to your Supabase dashboard
2. Navigate to the "SQL Editor" section
3. Create a new query
4. Copy and paste the SQL from the `supabase-storage-rls.sql` file in this repository
5. Run the query

The SQL script will:
- Create the "documents" bucket if it doesn't exist
- Enable Row Level Security on the storage.objects table
- Create policies that allow users to access only their own files
- Create a policy that allows the service role to access all files

## Step 3: Configure Environment Variables

Make sure your `.env.local` file includes the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DOCS_BUCKET=documents
```

## Step 4: Initialize the Storage Bucket

The application will initialize the storage bucket when it starts up. You can also trigger this manually by calling the initialization API endpoint:

```
curl -X GET http://localhost:3000/api/init/storage
```

## Troubleshooting

### Invalid Signature Error

If you see an "invalid signature" error when uploading files, it could be due to:

1. Missing or incorrect environment variables
2. Missing RLS policies
3. The bucket doesn't exist

Check the server logs for more details and ensure you've completed all the steps above.

### Permission Denied Error

If you see a "permission denied" error, it's likely due to RLS policies. Make sure:

1. The RLS policies are set up correctly
2. You're using the correct user ID in the file path
3. You're using the service role key for server-side operations

## File Structure

Files are stored in the following structure:

```
documents/{userId}/{randomUUID}.{extension}
```

For example:
```
documents/123e4567-e89b-12d3-a456-426614174000/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
```

This structure ensures that each user's files are isolated and can only be accessed by that user (or the service role). 