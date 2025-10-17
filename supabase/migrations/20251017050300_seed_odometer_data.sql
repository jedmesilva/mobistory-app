-- =====================================================
-- SEED DATA FOR ODOMETER SYSTEM
-- =====================================================

-- Criar odômetros para os veículos existentes
-- Honda Civic (João Silva)
INSERT INTO vehicle_odometers (vehicle_id, odometer_type, unit, max_reading, installed_at, active)
SELECT
  id,
  'digital',
  'km',
  999999,
  '2018-03-15 10:00:00',
  true
FROM vehicles
WHERE chassis = '9BWZZZ377VT004251';

-- Toyota Corolla (Maria Santos)
INSERT INTO vehicle_odometers (vehicle_id, odometer_type, unit, max_reading, installed_at, active)
SELECT
  id,
  'digital',
  'km',
  999999,
  '2020-05-20 14:30:00',
  true
FROM vehicles
WHERE chassis = '9BR5N2JE0N0123456';

-- Chevrolet Onix (Pedro Oliveira - locatário)
INSERT INTO vehicle_odometers (vehicle_id, odometer_type, unit, max_reading, installed_at, active)
SELECT
  id,
  'digital',
  'km',
  999999,
  '2019-08-10 09:00:00',
  true
FROM vehicles
WHERE chassis = '9BGKS69X0PG123789';

-- Criar leituras de odômetro para Honda Civic
-- Leitura inicial (compra do veículo)
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  15230,
  '2018-03-15 10:00:00',
  'manual',
  'regular',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND vo.vehicle_id = v.id;

-- Leitura após 6 meses
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  22100,
  '2018-09-20 16:30:00',
  'manual',
  'maintenance',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND vo.vehicle_id = v.id;

-- Leitura recente (via foto OCR)
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated, notes)
SELECT
  vo.id,
  45234,
  NOW() - INTERVAL '5 days',
  'photo_ocr',
  'regular',
  e.id,
  95,
  true,
  'Foto do painel tirada pelo app'
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND vo.vehicle_id = v.id;

-- Leitura atual
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  45690,
  NOW() - INTERVAL '2 hours',
  'manual',
  'fuel',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND vo.vehicle_id = v.id;

-- Criar leituras de odômetro para Toyota Corolla
-- Leitura inicial
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  8450,
  '2020-05-20 14:30:00',
  'manual',
  'regular',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND vo.vehicle_id = v.id;

-- Leitura após 1 ano
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  20100,
  '2021-06-15 11:00:00',
  'workshop',
  'maintenance',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND vo.vehicle_id = v.id;

-- Leitura atual
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  52890,
  NOW() - INTERVAL '1 day',
  'manual',
  'fuel',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND vo.vehicle_id = v.id;

-- Criar leituras de odômetro para Chevrolet Onix (carro alugado)
-- Leitura inicial
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  35600,
  '2024-01-10 08:00:00',
  'manual',
  'regular',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND vo.vehicle_id = v.id;

-- Leitura atual
INSERT INTO odometer_readings (vehicle_odometer_id, reading, reading_at, source, reading_type, recorded_by, confidence_score, is_validated)
SELECT
  vo.id,
  48920,
  NOW() - INTERVAL '3 days',
  'gps_tracker',
  'regular',
  e.id,
  100,
  true
FROM vehicle_odometers vo
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND vo.vehicle_id = v.id;
