# Document Management System

This document management system provides secure storage, retrieval, and management of documents with AWS KMS encryption.

## Features

- **Secure Document Storage**: All documents are encrypted using AWS KMS before being stored in Supabase Storage
- **Document Tagging**: Organize documents with custom tags
- **Document Center**: Central interface for managing all your documents
- **Chat Integration**: Upload and reference documents directly in chat conversations
- **Automatic Text Extraction**: Extract text content from PDFs and images for AI processing

## Security Features

### KMS Encryption

All documents are encrypted using AWS KMS (Key Management Service) before being stored in Supabase Storage. This provides:

- **Server-side encryption**: Documents are encrypted before they leave your server
- **Centralized key management**: AWS KMS provides secure key storage and management
- **Access control**: Only authorized users can decrypt and access documents
- **Audit trails**: All encryption and decryption operations are logged in AWS CloudTrail

### Implementation Details

The document management system implements encryption in the following way:

1. **Upload Process**:
   - When a document is uploaded, it is first encrypted using the AWS KMS key
   - The encrypted document is then stored in Supabase Storage
   - The document record in the database is marked as encrypted (`isEncrypted = true`)

2. **Retrieval Process**:
   - When a document is requested, the system checks if it's encrypted
   - If encrypted, the document is retrieved from storage and decrypted using AWS KMS
   - The decrypted content is then processed for text extraction

3. **Deletion Process**:
   - When a document is deleted, both the database record and the file in storage are removed
   - This ensures no orphaned files remain in the storage bucket

## Setup

To set up the document management system with KMS encryption:

1. Follow the instructions in the `kms-setup-guide.md` file to set up AWS KMS
2. Run the SQL migration script to add the `is_encrypted` column to the documents table
3. Configure the environment variables as specified in the setup guide

## Usage

### Uploading Documents

Documents can be uploaded through:
- The Document Center modal
- The chat interface when sending a message

All uploaded documents are automatically encrypted using AWS KMS.

### Managing Documents

The Document Center provides a central interface for:
- Viewing all uploaded documents
- Filtering documents by tag
- Uploading new documents
- Deleting existing documents

### Using Documents in Chat

Documents can be referenced in chat conversations by:
1. Uploading a document when sending a message
2. The system will extract text content from the document
3. The AI will process both your message and the document content

## Technical Implementation

The document management system is built using:
- Supabase Storage for file storage
- PostgreSQL database for document metadata
- AWS KMS for encryption
- Drizzle ORM for database operations
- Next.js Server Actions for backend operations

For more technical details, refer to the following files:
- `actions/storage/storage-actions.ts`: Document upload and retrieval logic
- `actions/db/documents-actions.ts`: Document database operations
- `db/schema/documents-schema.ts`: Document database schema
- `app/(protected)/documents/_components/document-center-modal.tsx`: Document management UI 