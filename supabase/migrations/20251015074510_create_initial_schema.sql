-- Test table to validate Supabase connection
CREATE TABLE test_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for testing)
CREATE POLICY "Allow public read access" ON test_table
  FOR SELECT
  USING (true);

-- Allow public insert access (for testing)
CREATE POLICY "Allow public insert access" ON test_table
  FOR INSERT
  WITH CHECK (true);

-- Insert test data
INSERT INTO test_table (name, description) VALUES
  ('Test 1', 'First test row'),
  ('Test 2', 'Second test row'),
  ('Test 3', 'Third test row');

-- Table comment
COMMENT ON TABLE test_table IS 'Test table to validate Supabase connection';
