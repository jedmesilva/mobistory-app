-- =====================================================
-- ADD REAL IMAGES TO MOMENTS
-- =====================================================

-- Adicionar imagem ao momento 1 (João Silva - Honda Civic - "Manhã de domingo")
INSERT INTO moment_images (moment_id, image_url, image_order)
SELECT
  m.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/moment-images/dogge%20challenge.jpg',
  1
FROM moments m
WHERE m.caption LIKE '%Manhã de domingo%'
LIMIT 1;

-- Adicionar imagem ao momento 2 (Maria Santos - Toyota Corolla - "manutenção preventiva")
INSERT INTO moment_images (moment_id, image_url, image_order)
SELECT
  m.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/moment-images/fiat%20strada.png',
  1
FROM moments m
WHERE m.caption LIKE '%manutenção preventiva%'
LIMIT 1;

-- Adicionar imagem ao momento 3 (Pedro Oliveira - Chevrolet Onix - "Abasteci")
INSERT INTO moment_images (moment_id, image_url, image_order)
SELECT
  m.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/moment-images/mustang.jpeg',
  1
FROM moments m
WHERE m.caption LIKE '%Abasteci no caminho%'
LIMIT 1;

-- Adicionar imagem ao momento 4 (Ana Costa - Volkswagen Gol - "companheiro")
INSERT INTO moment_images (moment_id, image_url, image_order)
SELECT
  m.id,
  'https://fsjncmqncdjevxvikdxo.supabase.co/storage/v1/object/public/moment-images/opala.webp',
  1
FROM moments m
WHERE m.caption LIKE '%companheiro de todas as horas%'
LIMIT 1;
