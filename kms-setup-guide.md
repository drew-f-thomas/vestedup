# AWS KMS Setup Guide for Document Encryption

This guide explains how to set up AWS KMS for document encryption in the application.

## Prerequisites

- An AWS account with permissions to create and manage KMS keys
- Access to your application's environment variables

## Step 1: Create a KMS Key in AWS

1. Sign in to the AWS Management Console
2. Navigate to the KMS service (search for "KMS" in the services search bar)
3. Click "Create key"
4. Choose "Symmetric" for the key type
5. Choose "Encrypt and decrypt" for the key usage
6. Click "Next"
7. Enter a descriptive alias for your key (e.g., "document-encryption-key")
8. Add any tags if needed
9. Click "Next"
10. Define key administrators (users who can manage the key)
11. Click "Next"
12. Define key users (users who can use the key for encryption/decryption)
13. Click "Next"
14. Review the key policy and click "Finish"
15. Note the Key ID (ARN) of your newly created key

## Step 2: Update Environment Variables

Add the following environment variables to your `.env.local` file:

```
# AWS KMS Configuration
KMS_KEY_ID=arn:aws:kms:region:account-id:key/key-id
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Replace the placeholders with your actual values:
- `KMS_KEY_ID`: The ARN of the KMS key you created
- `AWS_REGION`: The AWS region where your KMS key is located
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key

## Step 3: Update Supabase Schema

Run the `supabase-document-migration.sql` script in the Supabase SQL Editor to add the `is_encrypted` column to the `documents` table.

## Step 4: Verify Setup

To verify that KMS encryption is working correctly:

1. Upload a document through the application
2. Check the `is_encrypted` field in the `documents` table - it should be `true`
3. Try to retrieve the document content through the application - it should be decrypted automatically

## Security Considerations

- Store your AWS credentials securely
- Use IAM roles with minimal permissions when possible
- Regularly rotate your AWS access keys
- Monitor KMS key usage through AWS CloudTrail
- Consider implementing key rotation for long-term security

## Troubleshooting

If you encounter issues with KMS encryption or decryption:

1. Check that all environment variables are set correctly
2. Verify that your AWS credentials have permission to use the KMS key
3. Check the application logs for specific error messages
4. Ensure the AWS SDK is properly installed (`@aws-sdk/client-kms`)
5. Verify that the `is_encrypted` column exists in the `documents` table 