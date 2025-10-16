-- =====================================================
-- SEED DATA FOR ENTITIES AND VEHICLE LINKS
-- =====================================================

-- Criar entidades de exemplo (pessoas)
INSERT INTO entities (entity_type, name, email, phone, document_number, active) VALUES
('person', 'João Silva', 'joao.silva@email.com', '+55 11 98765-4321', '123.456.789-00', true),
('person', 'Maria Santos', 'maria.santos@email.com', '+55 11 98765-4322', '234.567.890-11', true),
('person', 'Pedro Oliveira', 'pedro.oliveira@email.com', '+55 11 98765-4323', '345.678.901-22', true),
('person', 'Ana Costa', 'ana.costa@email.com', '+55 11 98765-4324', '456.789.012-33', true);

-- Criar uma entidade AI de exemplo (preparando para o futuro)
INSERT INTO entities (
  entity_type, 
  name, 
  ai_model, 
  ai_capabilities,
  metadata,
  active
) VALUES (
  'ai_agent',
  'Claude Vehicle Assistant',
  'claude-3-5-sonnet',
  '{
    "can_analyze_maintenance": true,
    "can_predict_issues": true,
    "can_recommend_actions": true,
    "can_answer_questions": true,
    "can_schedule_maintenance": false,
    "can_control_vehicle": false
  }'::jsonb,
  '{
    "description": "AI assistant for vehicle maintenance and monitoring",
    "version": "1.0.0",
    "provider": "Anthropic"
  }'::jsonb,
  true
);

-- Criar dispositivo IoT de exemplo
INSERT INTO entities (
  entity_type,
  name,
  device_serial,
  device_type,
  metadata,
  active
) VALUES (
  'iot_device',
  'GPS Tracker Pro',
  'GPS-2024-8821',
  'gps_tracker',
  '{
    "manufacturer": "TechTrack",
    "model": "GT-Pro-500",
    "firmware_version": "2.4.1"
  }'::jsonb,
  true
);

-- Criar vínculos entre entidades e veículos
-- João Silva como proprietário do Honda Civic
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions,
  notes
)
SELECT 
  v.id,
  e.id,
  'owner',
  'active',
  '2021-03-15',
  '{
    "can_drive": true,
    "can_modify": true,
    "can_sell": true,
    "can_add_drivers": true,
    "can_access_all_data": true
  }'::jsonb,
  'Proprietário original do veículo'
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'João Silva'
LIMIT 1;

-- Maria Santos como proprietária do Toyota Corolla
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions
)
SELECT 
  v.id,
  e.id,
  'owner',
  'active',
  '2022-01-20',
  '{
    "can_drive": true,
    "can_modify": true,
    "can_sell": true,
    "can_add_drivers": true,
    "can_access_all_data": true
  }'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'Maria Santos'
LIMIT 1;

-- Pedro Oliveira como locatário do Chevrolet Onix
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  end_date,
  permissions,
  notes
)
SELECT 
  v.id,
  e.id,
  'renter',
  'active',
  '2024-01-01',
  '2024-12-31',
  '{
    "can_drive": true,
    "can_modify": false,
    "can_sell": false,
    "can_add_drivers": false,
    "can_access_basic_data": true
  }'::jsonb,
  'Contrato de locação de 12 meses'
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BGKS69X0PG123789'
  AND e.name = 'Pedro Oliveira'
LIMIT 1;

-- Ana Costa como proprietária do Volkswagen Gol
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions
)
SELECT 
  v.id,
  e.id,
  'owner',
  'active',
  '2019-05-12',
  '{
    "can_drive": true,
    "can_modify": true,
    "can_sell": true,
    "can_add_drivers": true,
    "can_access_all_data": true
  }'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BWAA05U6KP456123'
  AND e.name = 'Ana Costa'
LIMIT 1;

-- Ana Costa também é condutora autorizada do Hyundai HB20 (veículo compartilhado)
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions,
  notes
)
SELECT 
  v.id,
  e.id,
  'authorized_driver',
  'active',
  '2023-05-15',
  '{
    "can_drive": true,
    "can_modify": false,
    "can_sell": false,
    "can_add_drivers": false,
    "can_access_basic_data": true
  }'::jsonb,
  'Autorizada pela família para uso do veículo'
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BHBC41DAML789456'
  AND e.name = 'Ana Costa'
LIMIT 1;

-- João Silva como proprietário do Hyundai HB20
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions
)
SELECT 
  v.id,
  e.id,
  'owner',
  'active',
  '2020-11-08',
  '{
    "can_drive": true,
    "can_modify": true,
    "can_sell": true,
    "can_add_drivers": true,
    "can_access_all_data": true
  }'::jsonb
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BHBC41DAML789456'
  AND e.name = 'João Silva'
LIMIT 1;

-- AI Assistant vinculado ao Honda Civic (exemplo futuro)
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions,
  notes
)
SELECT 
  v.id,
  e.id,
  'ai_assistant',
  'active',
  CURRENT_DATE,
  '{
    "can_read_telemetry": true,
    "can_read_maintenance_history": true,
    "can_analyze_patterns": true,
    "can_send_alerts": true,
    "can_recommend_maintenance": true,
    "can_answer_questions": true,
    "can_control_vehicle": false,
    "can_modify_data": false
  }'::jsonb,
  'AI assistant para manutenção preditiva e suporte'
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BWZZZ377VT004251'
  AND e.name = 'Claude Vehicle Assistant'
LIMIT 1;

-- GPS Tracker vinculado ao Toyota Corolla
INSERT INTO vehicle_entity_links (
  vehicle_id,
  entity_id,
  relationship_type,
  status,
  start_date,
  permissions,
  notes
)
SELECT 
  v.id,
  e.id,
  'monitoring_device',
  'active',
  '2022-02-01',
  '{
    "can_read_location": true,
    "can_read_speed": true,
    "can_send_alerts": true,
    "can_record_trips": true,
    "can_control_vehicle": false
  }'::jsonb,
  'Dispositivo de rastreamento instalado'
FROM vehicles v
CROSS JOIN entities e
WHERE v.chassis = '9BR5N2JE0N0123456'
  AND e.name = 'GPS Tracker Pro'
LIMIT 1;
