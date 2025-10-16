-- =====================================================
-- VEHICLES SYSTEM - COMPLETE DATABASE SCHEMA
-- =====================================================

-- Countries
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  iso_code TEXT UNIQUE NOT NULL,
  iso3_code TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Brands
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Models
CREATE TABLE models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  model TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model Versions
CREATE TABLE model_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE RESTRICT,
  version TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fuel Types
CREATE TABLE fuels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Categories
CREATE TABLE vehicle_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plate Types
CREATE TABLE plate_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  format_pattern TEXT,
  valid_from DATE,
  valid_until DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE RESTRICT,
  version_id UUID REFERENCES model_versions(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES vehicle_categories(id) ON DELETE RESTRICT,
  chassis TEXT UNIQUE NOT NULL,
  model_year INTEGER NOT NULL,
  manufacture_year INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_years CHECK (manufacture_year <= model_year)
);

-- Vehicle Registrations
CREATE TABLE vehicle_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  registration_number TEXT NOT NULL,
  registration_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Plates
CREATE TABLE plates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  plate_type_id UUID NOT NULL REFERENCES plate_types(id) ON DELETE RESTRICT,
  plate TEXT NOT NULL,
  state TEXT,
  licensing_country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Colors
CREATE TABLE colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Fuels
CREATE TABLE vehicle_fuels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  fuel_id UUID NOT NULL REFERENCES fuels(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vehicles_chassis ON vehicles(chassis);
CREATE INDEX idx_plates_plate ON plates(plate);
CREATE INDEX idx_plates_vehicle_id ON plates(vehicle_id);
CREATE INDEX idx_colors_vehicle_id ON colors(vehicle_id);
CREATE INDEX idx_vehicle_fuels_vehicle_id ON vehicle_fuels(vehicle_id);

-- Unique Constraints
CREATE UNIQUE INDEX idx_plates_active_unique ON plates(vehicle_id) WHERE active = true;
CREATE UNIQUE INDEX idx_colors_active_unique ON colors(vehicle_id) WHERE active = true;

-- RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuels ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE plate_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plates ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_fuels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Allow public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public read models" ON models FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicles" ON vehicles FOR SELECT USING (true);
