-- =====================================================
-- UPDATE VEHICLE IMAGES - Replace placeholders with real images
-- =====================================================

-- First, let's check if there are existing images and update them
-- If no images exist, we'll insert new ones

-- Honda Civic (Black) - Civic preto elegante
UPDATE vehicle_images
SET image_url = 'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/shutterstock_2516905413.jpg'
WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis = '9BWZZZ377VT004251')
  AND is_primary = true;

-- Toyota Corolla (Silver) - Corolla prata
UPDATE vehicle_images
SET image_url = 'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/sem-titulo.webp'
WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis = '9BR5N2JE0N0123456')
  AND is_primary = true;

-- Chevrolet Onix (White) - Onix branco
UPDATE vehicle_images
SET image_url = 'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/fl_progressive,f_webp,w_592.webp'
WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis = '9BGKS69X0PG123789')
  AND is_primary = true;

-- Volkswagen Gol (Red) - Gol vermelho
UPDATE vehicle_images
SET image_url = 'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/ford_ka_2021_perfil_frente.jpg'
WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis = '9BWAA05U6KP456123')
  AND is_primary = true;

-- Hyundai HB20 (Blue) - HB20 azul
UPDATE vehicle_images
SET image_url = 'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/vehicle-images/carro-popular-960x540.jpg'
WHERE vehicle_id IN (SELECT id FROM vehicles WHERE chassis = '9BHBC41DAML789456')
  AND is_primary = true;
