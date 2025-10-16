-- =====================================================
-- SEED DATA FOR VEHICLES AND RELATED TABLES
-- =====================================================

-- Clean existing test data first
DELETE FROM vehicle_registrations WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis LIKE '9B%');
DELETE FROM vehicle_fuels WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis LIKE '9B%');
DELETE FROM colors WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis LIKE '9B%');
DELETE FROM plates WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis LIKE '9B%');
DELETE FROM vehicles WHERE chassis LIKE '9B%';

-- Model Versions for popular models
INSERT INTO model_versions (model_id, version, active)
SELECT m.id, v.version, true
FROM models m
CROSS JOIN LATERAL (VALUES ('1.0'), ('1.4'), ('1.6'), ('1.8'), ('2.0')) AS v(version)
WHERE m.model IN ('Civic', 'Corolla', 'Onix', 'HB20', 'Gol')
ON CONFLICT DO NOTHING;

-- Specific versions for Civic
INSERT INTO model_versions (model_id, version, active)
SELECT m.id, v.version, true
FROM models m
CROSS JOIN LATERAL (VALUES ('EX'), ('EXL'), ('Touring'), ('Sport')) AS v(version)
WHERE m.model = 'Civic'
ON CONFLICT DO NOTHING;

-- Specific versions for Corolla
INSERT INTO model_versions (model_id, version, active)
SELECT m.id, v.version, true
FROM models m
CROSS JOIN LATERAL (VALUES ('GLi'), ('XEi'), ('Altis'), ('Hybrid')) AS v(version)
WHERE m.model = 'Corolla'
ON CONFLICT DO NOTHING;

-- Sample Vehicles with LIMIT 1 to prevent duplicates
-- Vehicle 1: Honda Civic 2020/2021
INSERT INTO vehicles (brand_id, model_id, version_id, category_id, chassis, model_year, manufacture_year, active)
SELECT b.id, m.id, mv.id, vc.id, '9BWZZZ377VT004251', 2021, 2020, true
FROM brands b, models m, model_versions mv, vehicle_categories vc
WHERE b.brand = 'Honda' AND m.model = 'Civic' AND m.brand_id = b.id
  AND mv.version = 'EXL' AND mv.model_id = m.id AND vc.category = 'Passenger'
LIMIT 1;

-- Vehicle 2: Toyota Corolla 2022/2022
INSERT INTO vehicles (brand_id, model_id, version_id, category_id, chassis, model_year, manufacture_year, active)
SELECT b.id, m.id, mv.id, vc.id, '9BR5N2JE0N0123456', 2022, 2022, true
FROM brands b, models m, model_versions mv, vehicle_categories vc
WHERE b.brand = 'Toyota' AND m.model = 'Corolla' AND m.brand_id = b.id
  AND mv.version = 'XEi' AND mv.model_id = m.id AND vc.category = 'Passenger'
LIMIT 1;

-- Vehicle 3: Chevrolet Onix 2023/2023
INSERT INTO vehicles (brand_id, model_id, version_id, category_id, chassis, model_year, manufacture_year, active)
SELECT b.id, m.id, mv.id, vc.id, '9BGKS69X0PG123789', 2023, 2023, true
FROM brands b, models m, model_versions mv, vehicle_categories vc
WHERE b.brand = 'Chevrolet' AND m.model = 'Onix' AND m.brand_id = b.id
  AND mv.version = '1.0' AND mv.model_id = m.id AND vc.category = 'Passenger'
LIMIT 1;

-- Vehicle 4: Volkswagen Gol 2019/2019
INSERT INTO vehicles (brand_id, model_id, version_id, category_id, chassis, model_year, manufacture_year, active)
SELECT b.id, m.id, mv.id, vc.id, '9BWAA05U6KP456123', 2019, 2019, true
FROM brands b, models m, model_versions mv, vehicle_categories vc
WHERE b.brand = 'Volkswagen' AND m.model = 'Gol' AND m.brand_id = b.id
  AND mv.version = '1.6' AND mv.model_id = m.id AND vc.category = 'Passenger'
LIMIT 1;

-- Vehicle 5: Hyundai HB20 2021/2020
INSERT INTO vehicles (brand_id, model_id, version_id, category_id, chassis, model_year, manufacture_year, active)
SELECT b.id, m.id, mv.id, vc.id, '9BHBC41DAML789456', 2021, 2020, true
FROM brands b, models m, model_versions mv, vehicle_categories vc
WHERE b.brand = 'Hyundai' AND m.model = 'HB20' AND m.brand_id = b.id
  AND mv.version = '1.6' AND mv.model_id = m.id AND vc.category = 'Passenger'
LIMIT 1;

-- Plates for vehicles (using Mercosul standard)
INSERT INTO plates (vehicle_id, plate_type_id, plate, state, licensing_country_id, start_date, active)
SELECT v.id, pt.id, 'ABC1D23', 'SP', c.id, '2021-03-15', true
FROM vehicles v, plate_types pt, countries c
WHERE v.chassis = '9BWZZZ377VT004251' AND pt.name = 'Mercosul' AND c.iso_code = 'BR'
LIMIT 1;

INSERT INTO plates (vehicle_id, plate_type_id, plate, state, licensing_country_id, start_date, active)
SELECT v.id, pt.id, 'DEF2E34', 'RJ', c.id, '2022-01-20', true
FROM vehicles v, plate_types pt, countries c
WHERE v.chassis = '9BR5N2JE0N0123456' AND pt.name = 'Mercosul' AND c.iso_code = 'BR'
LIMIT 1;

INSERT INTO plates (vehicle_id, plate_type_id, plate, state, licensing_country_id, start_date, active)
SELECT v.id, pt.id, 'GHI3F45', 'MG', c.id, '2023-02-10', true
FROM vehicles v, plate_types pt, countries c
WHERE v.chassis = '9BGKS69X0PG123789' AND pt.name = 'Mercosul' AND c.iso_code = 'BR'
LIMIT 1;

INSERT INTO plates (vehicle_id, plate_type_id, plate, state, licensing_country_id, start_date, active)
SELECT v.id, pt.id, 'JKL4G56', 'RS', c.id, '2019-05-12', true
FROM vehicles v, plate_types pt, countries c
WHERE v.chassis = '9BWAA05U6KP456123' AND pt.name = 'Mercosul' AND c.iso_code = 'BR'
LIMIT 1;

INSERT INTO plates (vehicle_id, plate_type_id, plate, state, licensing_country_id, start_date, active)
SELECT v.id, pt.id, 'MNO5H67', 'PR', c.id, '2020-11-08', true
FROM vehicles v, plate_types pt, countries c
WHERE v.chassis = '9BHBC41DAML789456' AND pt.name = 'Mercosul' AND c.iso_code = 'BR'
LIMIT 1;

-- Colors for vehicles
INSERT INTO colors (vehicle_id, color, start_date, active)
SELECT v.id, 'Black', '2021-03-15', true FROM vehicles v WHERE v.chassis = '9BWZZZ377VT004251' LIMIT 1;

INSERT INTO colors (vehicle_id, color, start_date, active)
SELECT v.id, 'Silver', '2022-01-20', true FROM vehicles v WHERE v.chassis = '9BR5N2JE0N0123456' LIMIT 1;

INSERT INTO colors (vehicle_id, color, start_date, active)
SELECT v.id, 'White', '2023-02-10', true FROM vehicles v WHERE v.chassis = '9BGKS69X0PG123789' LIMIT 1;

INSERT INTO colors (vehicle_id, color, start_date, active)
SELECT v.id, 'Red', '2019-05-12', true FROM vehicles v WHERE v.chassis = '9BWAA05U6KP456123' LIMIT 1;

INSERT INTO colors (vehicle_id, color, start_date, active)
SELECT v.id, 'Blue', '2020-11-08', true FROM vehicles v WHERE v.chassis = '9BHBC41DAML789456' LIMIT 1;

-- Vehicle Fuels
INSERT INTO vehicle_fuels (vehicle_id, fuel_id, start_date, active, notes)
SELECT v.id, f.id, '2021-03-15', true, 'Original factory fuel type'
FROM vehicles v, fuels f
WHERE v.chassis = '9BWZZZ377VT004251' AND f.name = 'Gasoline' LIMIT 1;

INSERT INTO vehicle_fuels (vehicle_id, fuel_id, start_date, active, notes)
SELECT v.id, f.id, '2022-01-20', true, 'Flex fuel engine'
FROM vehicles v, fuels f
WHERE v.chassis = '9BR5N2JE0N0123456' AND f.name = 'Flex' LIMIT 1;

INSERT INTO vehicle_fuels (vehicle_id, fuel_id, start_date, active, notes)
SELECT v.id, f.id, '2023-02-10', true, 'Flex fuel engine'
FROM vehicles v, fuels f
WHERE v.chassis = '9BGKS69X0PG123789' AND f.name = 'Flex' LIMIT 1;

INSERT INTO vehicle_fuels (vehicle_id, fuel_id, start_date, active, notes)
SELECT v.id, f.id, '2019-05-12', true, 'Flex fuel engine'
FROM vehicles v, fuels f
WHERE v.chassis = '9BWAA05U6KP456123' AND f.name = 'Flex' LIMIT 1;

INSERT INTO vehicle_fuels (vehicle_id, fuel_id, start_date, active, notes)
SELECT v.id, f.id, '2020-11-08', true, 'Flex fuel engine'
FROM vehicles v, fuels f
WHERE v.chassis = '9BHBC41DAML789456' AND f.name = 'Flex' LIMIT 1;

-- Vehicle Registrations
INSERT INTO vehicle_registrations (vehicle_id, country_id, registration_number, registration_type, start_date, active)
SELECT v.id, c.id, '123456789-0', 'PERMANENT', '2021-03-15', true
FROM vehicles v, countries c
WHERE v.chassis = '9BWZZZ377VT004251' AND c.iso_code = 'BR' LIMIT 1;

INSERT INTO vehicle_registrations (vehicle_id, country_id, registration_number, registration_type, start_date, active)
SELECT v.id, c.id, '234567890-1', 'PERMANENT', '2022-01-20', true
FROM vehicles v, countries c
WHERE v.chassis = '9BR5N2JE0N0123456' AND c.iso_code = 'BR' LIMIT 1;

INSERT INTO vehicle_registrations (vehicle_id, country_id, registration_number, registration_type, start_date, active)
SELECT v.id, c.id, '345678901-2', 'PERMANENT', '2023-02-10', true
FROM vehicles v, countries c
WHERE v.chassis = '9BGKS69X0PG123789' AND c.iso_code = 'BR' LIMIT 1;

INSERT INTO vehicle_registrations (vehicle_id, country_id, registration_number, registration_type, start_date, active)
SELECT v.id, c.id, '456789012-3', 'PERMANENT', '2019-05-12', true
FROM vehicles v, countries c
WHERE v.chassis = '9BWAA05U6KP456123' AND c.iso_code = 'BR' LIMIT 1;

INSERT INTO vehicle_registrations (vehicle_id, country_id, registration_number, registration_type, start_date, active)
SELECT v.id, c.id, '567890123-4', 'PERMANENT', '2020-11-08', true
FROM vehicles v, countries c
WHERE v.chassis = '9BHBC41DAML789456' AND c.iso_code = 'BR' LIMIT 1;
