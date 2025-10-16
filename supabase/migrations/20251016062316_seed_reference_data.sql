-- =====================================================
-- SEED DATA FOR REFERENCE TABLES
-- =====================================================

-- Countries
INSERT INTO countries (name, iso_code, iso3_code, active) VALUES
('Brazil', 'BR', 'BRA', true),
('Argentina', 'AR', 'ARG', true),
('Paraguay', 'PY', 'PRY', true),
('Uruguay', 'UY', 'URY', true),
('Chile', 'CL', 'CHL', true),
('United States', 'US', 'USA', true);

-- Fuel Types
INSERT INTO fuels (name, type, description, active) VALUES
('Gasoline', 'fossil', 'Regular gasoline fuel', true),
('Ethanol', 'renewable', 'Ethanol biofuel', true),
('Diesel', 'fossil', 'Diesel fuel', true),
('CNG', 'fossil', 'Compressed Natural Gas', true),
('Electric', 'renewable', 'Electric battery', true),
('Flex', 'hybrid', 'Gasoline and Ethanol flex fuel', true),
('Hybrid', 'hybrid', 'Gasoline and Electric hybrid', true);

-- Vehicle Categories
INSERT INTO vehicle_categories (category, description, active) VALUES
('Passenger', 'Regular passenger cars', true),
('SUV', 'Sport Utility Vehicles', true),
('Truck', 'Pickup trucks and cargo trucks', true),
('Motorcycle', 'Motorcycles and scooters', true),
('Bus', 'Buses and vans for passenger transport', true),
('Van', 'Commercial vans and cargo vans', true);

-- Brands (Popular Brazilian Market)
INSERT INTO brands (brand, verified, active) VALUES
('Fiat', true, true),
('Volkswagen', true, true),
('Chevrolet', true, true),
('Ford', true, true),
('Toyota', true, true),
('Honda', true, true),
('Hyundai', true, true),
('Renault', true, true),
('Nissan', true, true),
('Jeep', true, true);

-- Models for Fiat
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Uno'),
  ('Palio'),
  ('Strada'),
  ('Argo'),
  ('Mobi'),
  ('Toro')
) AS m(model)
WHERE b.brand = 'Fiat';

-- Models for Volkswagen
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Gol'),
  ('Polo'),
  ('Virtus'),
  ('T-Cross'),
  ('Nivus'),
  ('Saveiro')
) AS m(model)
WHERE b.brand = 'Volkswagen';

-- Models for Chevrolet
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Onix'),
  ('Prisma'),
  ('Tracker'),
  ('S10'),
  ('Spin'),
  ('Montana')
) AS m(model)
WHERE b.brand = 'Chevrolet';

-- Models for Ford
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Ka'),
  ('Fiesta'),
  ('EcoSport'),
  ('Ranger'),
  ('Territory'),
  ('Mustang')
) AS m(model)
WHERE b.brand = 'Ford';

-- Models for Toyota
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Corolla'),
  ('Hilux'),
  ('SW4'),
  ('Yaris'),
  ('RAV4'),
  ('Camry')
) AS m(model)
WHERE b.brand = 'Toyota';

-- Models for Honda
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Civic'),
  ('City'),
  ('HR-V'),
  ('CR-V'),
  ('Fit'),
  ('WR-V')
) AS m(model)
WHERE b.brand = 'Honda';

-- Models for Hyundai
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('HB20'),
  ('Creta'),
  ('Tucson'),
  ('Santa Fe'),
  ('i30'),
  ('Azera')
) AS m(model)
WHERE b.brand = 'Hyundai';

-- Models for Renault
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Kwid'),
  ('Sandero'),
  ('Logan'),
  ('Duster'),
  ('Captur'),
  ('Oroch')
) AS m(model)
WHERE b.brand = 'Renault';

-- Models for Nissan
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Versa'),
  ('Kicks'),
  ('Frontier'),
  ('Sentra'),
  ('March'),
  ('Leaf')
) AS m(model)
WHERE b.brand = 'Nissan';

-- Models for Jeep
INSERT INTO models (brand_id, model, verified, active)
SELECT b.id, m.model, true, true
FROM brands b
CROSS JOIN (VALUES
  ('Renegade'),
  ('Compass'),
  ('Commander'),
  ('Wrangler'),
  ('Grand Cherokee'),
  ('Cherokee')
) AS m(model)
WHERE b.brand = 'Jeep';

-- Plate Types for Brazil
INSERT INTO plate_types (country_id, name, description, format_pattern, valid_from, active)
SELECT c.id, 'Mercosul', 'Brazilian Mercosul standard plate', '^[A-Z]{3}[0-9][A-Z][0-9]{2}$', '2018-01-01', true
FROM countries c WHERE c.iso_code = 'BR';

INSERT INTO plate_types (country_id, name, description, format_pattern, valid_until, active)
SELECT c.id, 'Old Gray', 'Brazilian old gray plate standard', '^[A-Z]{3}[0-9]{4}$', '2020-12-31', true
FROM countries c WHERE c.iso_code = 'BR';

-- Plate Types for Argentina
INSERT INTO plate_types (country_id, name, description, format_pattern, valid_from, active)
SELECT c.id, 'New Patent', 'Argentine new patent standard', '^[A-Z]{2}[0-9]{3}[A-Z]{2}$', '2016-01-01', true
FROM countries c WHERE c.iso_code = 'AR';
