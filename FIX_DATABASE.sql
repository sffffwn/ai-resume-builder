-- # 🚀 QUICK FIX: Run this in your Supabase SQL Editor
-- This will enable the new Templates and ATS features.

-- 1. Add Template ID column
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern';

-- 2. Add ATS Report column
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS ats_report JSONB DEFAULT '{}';

-- 3. Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resumes' 
AND column_name IN ('template_id', 'ats_report');
