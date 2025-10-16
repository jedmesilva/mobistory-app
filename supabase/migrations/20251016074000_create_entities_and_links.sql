-- =====================================================
-- ENTITIES AND VEHICLE LINKS SYSTEM
-- =====================================================

-- Tabela de Entidades (pessoas, AI, dispositivos, organizações)
CREATE TABLE entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('person', 'ai_agent', 'iot_device', 'organization', 'robot')),
  name TEXT NOT NULL,
  
  -- Para pessoas
  email TEXT,
  phone TEXT,
  document_number TEXT,
  
  -- Para AI agents
  ai_model TEXT,
  ai_capabilities JSONB,
  
  -- Para dispositivos IoT
  device_serial TEXT,
  device_type TEXT,
  
  -- Para organizações
  legal_id TEXT,
  organization_type TEXT,
  
  -- Vinculo com Supabase Auth (opcional, só para pessoas)
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dados flexíveis
  metadata JSONB,
  
  -- Controle
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Vínculos Entidade-Veículo
CREATE TABLE vehicle_entity_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  
  -- Tipo de relacionamento
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'owner', 'co_owner', 'renter', 'authorized_driver', 
    'ai_assistant', 'monitoring_device', 'maintenance_robot',
    'fleet_manager', 'emergency_contact', 'insurance_company'
  )),
  
  -- Permissões (principalmente para AI e dispositivos)
  permissions JSONB DEFAULT '{}'::jsonb,
  
  -- Status do vínculo
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated', 'pending')),
  
  -- Período de validade
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Metadados
  notes TEXT,
  created_by UUID REFERENCES entities(id),
  
  -- Controle
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garante que não haja vínculos duplicados no mesmo período
  CONSTRAINT unique_active_link UNIQUE(vehicle_id, entity_id, relationship_type, start_date)
);

-- Índices para performance
CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_email ON entities(email) WHERE email IS NOT NULL;
CREATE INDEX idx_entities_auth_user ON entities(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX idx_entities_active ON entities(active);

CREATE INDEX idx_vehicle_links_vehicle ON vehicle_entity_links(vehicle_id);
CREATE INDEX idx_vehicle_links_entity ON vehicle_entity_links(entity_id);
CREATE INDEX idx_vehicle_links_relationship ON vehicle_entity_links(relationship_type);
CREATE INDEX idx_vehicle_links_status ON vehicle_entity_links(status);
CREATE INDEX idx_vehicle_links_active ON vehicle_entity_links(active);
CREATE INDEX idx_vehicle_links_dates ON vehicle_entity_links(start_date, end_date);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_links_updated_at
  BEFORE UPDATE ON vehicle_entity_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_entity_links ENABLE ROW LEVEL SECURITY;

-- Policies: Por enquanto permitir leitura pública (ajustaremos depois com auth)
CREATE POLICY "Allow public read entities" ON entities FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicle_entity_links" ON vehicle_entity_links FOR SELECT USING (true);

-- Policy: Usuários autenticados podem criar vínculos
CREATE POLICY "Authenticated users can create links" ON vehicle_entity_links 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Usuários podem atualizar seus próprios vínculos
CREATE POLICY "Users can update their own links" ON vehicle_entity_links 
  FOR UPDATE 
  USING (entity_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

-- Comentários para documentação
COMMENT ON TABLE entities IS 'Armazena todas as entidades que podem ter vínculo com veículos: pessoas, AI agents, dispositivos IoT, robôs, organizações';
COMMENT ON TABLE vehicle_entity_links IS 'Vínculos entre entidades e veículos com permissões e período de validade';

COMMENT ON COLUMN entities.entity_type IS 'Tipo de entidade: person, ai_agent, iot_device, organization, robot';
COMMENT ON COLUMN entities.ai_capabilities IS 'JSON com capacidades do agente de AI';
COMMENT ON COLUMN entities.metadata IS 'Dados adicionais flexíveis específicos por tipo';

COMMENT ON COLUMN vehicle_entity_links.permissions IS 'JSON com permissões granulares (can_drive, can_read_data, can_control, etc)';
COMMENT ON COLUMN vehicle_entity_links.relationship_type IS 'Tipo de relacionamento: owner, renter, ai_assistant, monitoring_device, etc';
COMMENT ON COLUMN vehicle_entity_links.status IS 'Status do vínculo: active, suspended, terminated, pending';
