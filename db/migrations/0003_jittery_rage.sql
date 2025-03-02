DO $$ BEGIN
 CREATE TYPE "public"."prompt_type" AS ENUM('system', 'user', 'assistant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "membership" ADD VALUE 'admin';--> statement-breakpoint
ALTER TABLE "prompts" ALTER COLUMN "is_active" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "prompts" ALTER COLUMN "is_active" SET DEFAULT 'true';--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "type" "prompt_type" DEFAULT 'system' NOT NULL;