-- =====================================================
-- SEED DATA FOR CONVERSATIONS AND MESSAGES
-- =====================================================

-- Criar conversa entre João Silva e seu Honda Civic
INSERT INTO conversations (vehicle_id, entity_id, title, status, last_message_at, last_message_preview, unread_count)
SELECT
  v.id,
  e.id,
  'Conversa sobre ' || b.brand || ' ' || m.model,
  'active',
  NOW() - INTERVAL '2 hours',
  'Olá! Como posso ajudar com seu veículo?',
  0
FROM vehicles v
CROSS JOIN entities e
CROSS JOIN brands b
CROSS JOIN models m
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND v.brand_id = b.id
  AND v.model_id = m.id
LIMIT 1;

-- Criar conversa entre Maria Santos e seu Toyota Corolla
INSERT INTO conversations (vehicle_id, entity_id, title, status, last_message_at, last_message_preview, unread_count)
SELECT
  v.id,
  e.id,
  'Conversa sobre ' || b.brand || ' ' || m.model,
  'active',
  NOW() - INTERVAL '5 hours',
  'Agendamento de revisão confirmado!',
  1
FROM vehicles v
CROSS JOIN entities e
CROSS JOIN brands b
CROSS JOIN models m
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND v.brand_id = b.id
  AND v.model_id = m.id
LIMIT 1;

-- Criar conversa entre Pedro Oliveira e Chevrolet Onix (locatário)
INSERT INTO conversations (vehicle_id, entity_id, title, status, last_message_at, last_message_preview, unread_count)
SELECT
  v.id,
  e.id,
  'Conversa sobre ' || b.brand || ' ' || m.model,
  'active',
  NOW() - INTERVAL '1 day',
  'Contrato de locação renovado até 2025',
  0
FROM vehicles v
CROSS JOIN entities e
CROSS JOIN brands b
CROSS JOIN models m
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND v.brand_id = b.id
  AND v.model_id = m.id
LIMIT 1;

-- Adicionar mensagens na conversa do João Silva (Honda Civic)
-- Mensagem 1: Sistema dando boas-vindas
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  e.id,
  'system',
  'Bem-vindo à conversa do seu Honda Civic! Aqui você pode tirar dúvidas sobre manutenção, histórico e muito mais.',
  'read',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Mensagem 2: João perguntando sobre manutenção
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  e.id,
  'text',
  'Oi! Quando preciso fazer a próxima revisão?',
  'read',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Mensagem 3: AI Assistant respondendo
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  ai.id,
  'text',
  'Olá João! De acordo com o histórico, sua última revisão foi há 8.500 km. A próxima está prevista para daqui a 1.500 km ou em 2 meses. 🔧',
  'read',
  NOW() - INTERVAL '2 days' + INTERVAL '5 minutes',
  NOW() - INTERVAL '2 days' + INTERVAL '5 minutes',
  NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'
FROM conversations c
CROSS JOIN entities ai
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND ai.name = 'Claude Vehicle Assistant'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Mensagem 4: João agradecendo
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  e.id,
  'text',
  'Perfeito! Vou agendar para o mês que vem. Obrigado!',
  'read',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Mensagem 5: AI Assistant com emoji
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  ai.id,
  'text',
  'Disponha! Qualquer dúvida, estou aqui. 🚗✨',
  'read',
  NOW() - INTERVAL '2 hours' + INTERVAL '2 minutes',
  NOW() - INTERVAL '2 hours' + INTERVAL '2 minutes',
  NOW() - INTERVAL '2 hours' + INTERVAL '2 minutes'
FROM conversations c
CROSS JOIN entities ai
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
  AND ai.name = 'Claude Vehicle Assistant'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Adicionar mensagens na conversa da Maria Santos (Toyota Corolla)
-- Mensagem 1: Maria perguntando sobre revisão
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  e.id,
  'text',
  'Gostaria de agendar a revisão dos 10.000 km',
  'read',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Mensagem 2: Sistema confirmando agendamento
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at)
SELECT
  c.id,
  e.id,
  'system',
  'Agendamento de revisão confirmado para 25/10/2025 às 14:00 na Concessionária Toyota Centro.',
  'delivered',
  NOW() - INTERVAL '5 hours',
  NOW() - INTERVAL '5 hours'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Adicionar mensagens na conversa do Pedro Oliveira (Chevrolet Onix - locatário)
-- Mensagem 1: Notificação de renovação
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  e.id,
  'system',
  'Seu contrato de locação foi renovado até 31/12/2025. Boas viagens! 🚗',
  'read',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;

-- Mensagem 2: Pedro respondendo
INSERT INTO messages (conversation_id, sender_id, message_type, content, status, sent_at, delivered_at, read_at)
SELECT
  c.id,
  e.id,
  'text',
  'Ótimo! Muito obrigado pela renovação.',
  'read',
  NOW() - INTERVAL '1 day' + INTERVAL '30 minutes',
  NOW() - INTERVAL '1 day' + INTERVAL '30 minutes',
  NOW() - INTERVAL '1 day' + INTERVAL '30 minutes'
FROM conversations c
CROSS JOIN entities e
CROSS JOIN vehicles v
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
  AND c.vehicle_id = v.id
  AND c.entity_id = e.id
LIMIT 1;
