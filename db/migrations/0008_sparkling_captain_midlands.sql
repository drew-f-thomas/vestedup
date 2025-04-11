DO $$ BEGIN
 CREATE TYPE "public"."tax_doc_type" AS ENUM('W2', '1099');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"document_id" uuid NOT NULL,
	"doc_type" "tax_doc_type" NOT NULL,
	"year" text,
	"employee_name" text,
	"employee_address" text,
	"employee_ssn" text,
	"employer_name" text,
	"employer_address" text,
	"employer_fed_id_number" text,
	"employer_state_id_number" text,
	"control_number" text,
	"wages_box_1" text,
	"fed_income_tax_box_2" text,
	"social_security_wages_box_3" text,
	"social_security_tax_box_4" text,
	"medicare_wages_box_5" text,
	"medicare_tax_box_6" text,
	"social_security_tips_box_7" text,
	"allocated_tips_box_8" text,
	"dependent_care_benefits_box_10" text,
	"nonqualified_plans_box_11" text,
	"state_wages_box_16" text,
	"state_income_tax_box_17" text,
	"local_wages_box_18" text,
	"local_income_tax_box_19" text,
	"locality_name_box_20" text,
	"statutory_employee_box_13" boolean,
	"retirement_plan_box_13" boolean,
	"third_party_sick_pay_box_13" boolean,
	"raw_parsed_content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tax_data" ADD CONSTRAINT "tax_data_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tax_data" ADD CONSTRAINT "tax_data_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
