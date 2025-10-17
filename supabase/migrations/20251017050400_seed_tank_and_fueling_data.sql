-- =====================================================
-- SEED DATA FOR TANK AND FUELING SYSTEM
-- =====================================================

-- Criar tanques para os veículos existentes
-- Honda Civic (João Silva) - Tanque original 50L
INSERT INTO vehicle_tanks (vehicle_id, capacity_liters, tank_type, material, installed_at, active)
SELECT
  id,
  50.00,
  'original',
  'plastic',
  '2018-03-15 10:00:00',
  true
FROM vehicles
WHERE chassis = '9BWZZZ377VT004251';

-- Toyota Corolla (Maria Santos) - Tanque original 54L
INSERT INTO vehicle_tanks (vehicle_id, capacity_liters, tank_type, material, installed_at, active)
SELECT
  id,
  54.00,
  'original',
  'plastic',
  '2020-05-20 14:30:00',
  true
FROM vehicles
WHERE chassis = '9BR5N2JE0N0123456';

-- Chevrolet Onix (Pedro Oliveira) - Tanque original 48L
INSERT INTO vehicle_tanks (vehicle_id, capacity_liters, tank_type, material, installed_at, active)
SELECT
  id,
  48.00,
  'original',
  'plastic',
  '2019-08-10 09:00:00',
  true
FROM vehicles
WHERE chassis = '9BGKS69X0PG123789';

-- Criar abastecimentos para Honda Civic (João Silva)
-- Abastecimento 1 (3 meses atrás) - Tanque cheio
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '3 months',
  42.50,
  5.89,
  250.32,
  true,
  42100,
  'Auto Posto Central',
  'Shell',
  'credit_card',
  e.id
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 2 (2 meses atrás) - Tanque cheio
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by,
  location_address
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '2 months',
  43.20,
  5.95,
  257.04,
  true,
  42650,
  'Posto Ipiranga Norte',
  'Ipiranga',
  'debit_card',
  e.id,
  'Av. Paulista, 1000 - São Paulo, SP'
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 3 (1 mês atrás) - Tanque cheio
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by,
  location_address
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '1 month',
  41.80,
  6.02,
  251.64,
  true,
  43200,
  'Shell Vila Mariana',
  'Shell',
  'pix',
  e.id,
  'Rua Domingos de Morais, 500 - São Paulo, SP'
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 4 (2 semanas atrás) - Parcial
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '2 weeks',
  25.00,
  6.10,
  152.50,
  false,
  44100,
  'Posto BR Petrobras',
  'Petrobras',
  'cash',
  e.id
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 5 (ontem) - Tanque cheio
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by,
  location_address,
  notes
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '1 day',
  44.50,
  6.15,
  273.68,
  true,
  45690,
  'Shell Centro',
  'Shell',
  'app',
  e.id,
  'Av. Brigadeiro Faria Lima, 3000 - São Paulo, SP',
  'Abastecimento via app Shell Box com desconto'
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND f.name = 'Gasolina Aditivada'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Criar abastecimentos para Toyota Corolla (Maria Santos)
-- Abastecimento 1 (2 meses atrás)
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '2 months',
  48.00,
  5.85,
  280.80,
  true,
  50200,
  'Ipiranga Express',
  'Ipiranga',
  'credit_card',
  e.id
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 2 (1 mês atrás)
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '1 month',
  49.50,
  6.00,
  297.00,
  true,
  51050,
  'Shell Avenida',
  'Shell',
  'debit_card',
  e.id
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 3 (semana passada)
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by,
  notes
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '7 days',
  47.20,
  6.08,
  287.00,
  true,
  52890,
  'Petrobras Centro',
  'Petrobras',
  'pix',
  e.id,
  'Bom atendimento e preço justo'
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND f.name = 'Gasolina Aditivada'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Criar abastecimentos para Chevrolet Onix (Pedro Oliveira - locatário)
-- Abastecimento 1 (1 mês atrás)
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '1 month',
  42.00,
  5.92,
  248.64,
  true,
  46500,
  'Posto Ale',
  'Ale',
  'credit_card',
  e.id
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 2 (2 semanas atrás)
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '2 weeks',
  40.50,
  6.05,
  245.03,
  true,
  47700,
  'Shell Rodovia',
  'Shell',
  'voucher',
  e.id
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;

-- Abastecimento 3 (ontem)
INSERT INTO fuelings (
  vehicle_tank_id,
  vehicle_id,
  fuel_id,
  fueling_at,
  liters,
  price_per_liter,
  total_amount,
  is_full_tank,
  odometer_reading,
  station_name,
  station_brand,
  payment_method,
  fueled_by,
  notes
)
SELECT
  vt.id,
  v.id,
  f.id,
  NOW() - INTERVAL '1 day',
  41.20,
  6.12,
  252.14,
  true,
  48920,
  'Ipiranga Auto',
  'Ipiranga',
  'debit_card',
  e.id,
  'Abastecimento de retorno para a locadora'
FROM vehicle_tanks vt
CROSS JOIN vehicles v
CROSS JOIN fuels f
CROSS JOIN entities e
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND f.name = 'Gasolina Comum'
  AND vt.vehicle_id = v.id
  AND vt.active = true;
