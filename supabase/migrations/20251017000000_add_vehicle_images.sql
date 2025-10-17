-- =====================================================
-- UPDATE VEHICLE IMAGES FROM STORAGE
-- =====================================================

-- Delete existing vehicle images first
DELETE FROM vehicle_images WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis LIKE '9B%');

-- Honda Civic (Black) - Civic preto elegante
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, width, height)
SELECT v.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/shutterstock_2516905413.jpg',
  true,
  NULL,
  NULL
FROM vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
LIMIT 1;

-- Toyota Corolla (Silver) - Corolla prata
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, width, height)
SELECT v.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/sem-titulo.webp',
  true,
  NULL,
  NULL
FROM vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
LIMIT 1;

-- Chevrolet Onix (White) - Onix branco
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, width, height)
SELECT v.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/fl_progressive,f_webp,w_592.webp',
  true,
  NULL,
  NULL
FROM vehicles v
WHERE v.chassis = '9BGKS69X0PG123789'
LIMIT 1;

-- Volkswagen Gol (Red) - Gol vermelho
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, width, height)
SELECT v.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/ford_ka_2021_perfil_frente.jpg',
  true,
  NULL,
  NULL
FROM vehicles v
WHERE v.chassis = '9BWAA05U6KP456123'
LIMIT 1;

-- Hyundai HB20 (Blue) - HB20 azul
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, width, height)
SELECT v.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/carro-popular-960x540.jpg',
  true,
  NULL,
  NULL
FROM vehicles v
WHERE v.chassis = '9BHBC41DAML789456'
LIMIT 1;
