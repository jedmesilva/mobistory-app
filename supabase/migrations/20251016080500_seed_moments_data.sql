-- =====================================================
-- SEED DATA FOR MOMENTS (Posts do Veículo)
-- =====================================================

-- Criar alguns momentos de exemplo
-- Momento 1: João Silva postando sobre seu Honda Civic
INSERT INTO moments (vehicle_id, entity_id, caption, type, location, tags)
SELECT
  v.id,
  e.id,
  'Manhã de domingo com meu querido Civic! 🌅 Rodão impecável!',
  'image',
  'São Paulo, SP',
  '["viagem", "domingo", "estrada"]'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
LIMIT 1;

-- Momento 2: Maria Santos no Toyota Corolla
INSERT INTO moments (vehicle_id, entity_id, caption, type, location, tags)
SELECT
  v.id,
  e.id,
  'Dia de manutenção preventiva! Carro sempre caprichado. 🔧',
  'image',
  'São Paulo, SP',
  '["manutencao", "cuidados", "mecanica"]'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
LIMIT 1;

-- Momento 3: Pedro Oliveira abastecendo o Onix
INSERT INTO moments (vehicle_id, entity_id, caption, type, location, tags)
SELECT
  v.id,
  e.id,
  'Abasteci no caminho pro trabalho. Consumo está ótimo! ⛽',
  'image',
  'Campinas, SP',
  '["abastecimento", "economia", "combustivel"]'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
LIMIT 1;

-- Momento 4: Ana Costa com o Volkswagen Gol
INSERT INTO moments (vehicle_id, entity_id, caption, type, location, tags)
SELECT
  v.id,
  e.id,
  'Meu companheiro de todas as horas! 12 anos juntos. ❤️',
  'image',
  'Santos, SP',
  '["nostalgia", "parceria", "historia"]'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BWAA05U6KP456123'
  AND e.name = 'Ana Costa'
LIMIT 1;

-- Momento 5: João Silva com o Hyundai HB20 (seu segundo carro)
INSERT INTO moments (vehicle_id, entity_id, caption, type, location, tags)
SELECT
  v.id,
  e.id,
  'Lavagem completa! Ficou novo! 💧✨',
  'image',
  'São Paulo, SP',
  '["limpeza", "cuidados", "estetica"]'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BHBC41DAML789456'
  AND e.name = 'João Silva'
LIMIT 1;

-- Adicionar algumas reações aos momentos
-- Reações no primeiro momento (João Silva - Civic)
INSERT INTO moment_reactions (moment_id, entity_id, reaction_type)
SELECT
  m.id,
  e.id,
  'like'
FROM moments m
CROSS JOIN entities e
WHERE m.caption LIKE '%Manhã de domingo%'
  AND e.name IN ('Maria Santos', 'Ana Costa', 'Pedro Oliveira')
LIMIT 3;

-- Reações no segundo momento (Maria Santos - Corolla)
INSERT INTO moment_reactions (moment_id, entity_id, reaction_type)
SELECT
  m.id,
  e.id,
  CASE
    WHEN e.name = 'João Silva' THEN 'love'
    ELSE 'like'
  END
FROM moments m
CROSS JOIN entities e
WHERE m.caption LIKE '%manutenção preventiva%'
  AND e.name IN ('João Silva', 'Ana Costa')
LIMIT 2;

-- Adicionar alguns comentários
-- Comentário no momento de João Silva
INSERT INTO moment_comments (moment_id, entity_id, comment)
SELECT
  m.id,
  e.id,
  'Que viagem incrível! Onde foi esse lugar?'
FROM moments m
CROSS JOIN entities e
WHERE m.caption LIKE '%Manhã de domingo%'
  AND e.name = 'Maria Santos'
LIMIT 1;

-- Resposta ao comentário
INSERT INTO moment_comments (moment_id, entity_id, comment, parent_comment_id)
SELECT
  m.id,
  e_joao.id,
  'Foi na estrada para o litoral! Lugar lindo demais.',
  c.id
FROM moments m
CROSS JOIN entities e_joao
CROSS JOIN moment_comments c
WHERE m.caption LIKE '%Manhã de domingo%'
  AND e_joao.name = 'João Silva'
  AND c.comment LIKE '%Que viagem incrível%'
LIMIT 1;

-- Comentário no momento de Maria Santos
INSERT INTO moment_comments (moment_id, entity_id, comment)
SELECT
  m.id,
  e.id,
  'Muito importante cuidar bem do carro! Parabéns pela dedicação.'
FROM moments m
CROSS JOIN entities e
WHERE m.caption LIKE '%manutenção preventiva%'
  AND e.name = 'Pedro Oliveira'
LIMIT 1;

-- Comentário no momento de Pedro
INSERT INTO moment_comments (moment_id, entity_id, comment)
SELECT
  m.id,
  e.id,
  'Qual foi a média de consumo?'
FROM moments m
CROSS JOIN entities e
WHERE m.caption LIKE '%Abasteci no caminho%'
  AND e.name = 'João Silva'
LIMIT 1;

-- Adicionar imagens principais aos veículos
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
SELECT
  v.id,
  'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Honda+Civic',
  true
FROM vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
LIMIT 1;

INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
SELECT
  v.id,
  'https://via.placeholder.com/800x600/10b981/ffffff?text=Toyota+Corolla',
  true
FROM vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
LIMIT 1;

INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
SELECT
  v.id,
  'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Chevrolet+Onix',
  true
FROM vehicles v
WHERE v.chassis = '9BGKS69X0PG123789'
LIMIT 1;

INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
SELECT
  v.id,
  'https://via.placeholder.com/800x600/ef4444/ffffff?text=Volkswagen+Gol',
  true
FROM vehicles v
WHERE v.chassis = '9BWAA05U6KP456123'
LIMIT 1;

INSERT INTO vehicle_images (vehicle_id, image_url, is_primary)
SELECT
  v.id,
  'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Hyundai+HB20',
  true
FROM vehicles v
WHERE v.chassis = '9BHBC41DAML789456'
LIMIT 1;
