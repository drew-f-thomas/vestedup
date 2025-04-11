-- Create the tax document type enum
DO $$ BEGIN
    CREATE TYPE "tax_doc_type" AS ENUM ('W2', '1099_MISC', '1099_K', '1098_T');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create the tax base table
CREATE TABLE IF NOT EXISTS "tax_base" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL REFERENCES "profiles"("user_id") ON DELETE CASCADE,
  "document_id" UUID NOT NULL REFERENCES "documents"("id") ON DELETE CASCADE,
  "doc_type" "tax_doc_type" NOT NULL,
  "filing_year" TEXT NOT NULL,
  "tax_period" TEXT,
  "is_verified" BOOLEAN DEFAULT FALSE,
  "is_amended" BOOLEAN DEFAULT FALSE,
  "raw_parsed_content" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create an index on filing year and user for quick lookup
CREATE INDEX IF NOT EXISTS "tax_base_year_user_idx" ON "tax_base" ("filing_year", "user_id");

-- Create the W2 data table
CREATE TABLE IF NOT EXISTS "w2_data" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tax_base_id" UUID NOT NULL REFERENCES "tax_base"("id") ON DELETE CASCADE,
  "employee_name" TEXT,
  "employee_address" TEXT,
  "employee_ssn" TEXT,
  "filing_status" TEXT,
  "employer_name" TEXT,
  "employer_address" TEXT,
  "employer_fed_id_number" TEXT,
  "employer_state_id_number" TEXT,
  "control_number" TEXT,
  "verification_code" TEXT,
  "wages_box_1" TEXT,
  "fed_income_tax_box_2" TEXT,
  "social_security_wages_box_3" TEXT,
  "social_security_tax_box_4" TEXT,
  "medicare_wages_box_5" TEXT,
  "medicare_tax_box_6" TEXT,
  "social_security_tips_box_7" TEXT,
  "allocated_tips_box_8" TEXT,
  "dependent_care_benefits_box_10" TEXT,
  "nonqualified_plans_box_11" TEXT,
  "box_12_codes" TEXT,
  "statutory_employee_box_13" BOOLEAN,
  "retirement_plan_box_13" BOOLEAN,
  "third_party_sick_pay_box_13" BOOLEAN,
  "box_14_items" TEXT,
  "state_wages_box_16" TEXT,
  "state_income_tax_box_17" TEXT,
  "local_wages_box_18" TEXT,
  "local_income_tax_box_19" TEXT,
  "locality_name_box_20" TEXT,
  "state_information" TEXT,
  "gross_pay" TEXT,
  "cafe_125_adjustments" TEXT,
  "hsa_adjustments" TEXT,
  "other_adjustments" TEXT,
  "reported_w2_wages" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create the 1099-MISC table (example for future use)
CREATE TABLE IF NOT EXISTS "form_1099_misc_data" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tax_base_id" UUID NOT NULL REFERENCES "tax_base"("id") ON DELETE CASCADE,
  "payer_name" TEXT,
  "payer_address" TEXT,
  "payer_tin" TEXT,
  "recipient_name" TEXT,
  "recipient_address" TEXT,
  "recipient_tin" TEXT,
  "recipient_account_number" TEXT,
  "rents" TEXT,
  "royalties" TEXT,
  "other_income" TEXT,
  "federal_income_tax_withheld" TEXT,
  "fishing_boat_proceeds" TEXT,
  "medical_payments" TEXT,
  "nonemployee_compensation" TEXT,
  "substitute_payments" TEXT,
  "crop_insurance_proceeds" TEXT,
  "gross_proceeds_to_attorney" TEXT,
  "state_information" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now()
); 