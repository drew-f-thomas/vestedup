DO $$ BEGIN
 CREATE TYPE "public"."document_tag" AS ENUM('stock_option_grant', 'rsu_grant', 'stock_option_agreement', 'valuation_report', '83b_election', 'vesting_schedule', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "document_tag" "document_tag" DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;