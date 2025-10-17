-- =====================================================
-- VEHICLE ODOMETER SYSTEM
-- Sistema de odômetros e leituras de quilometragem
-- =====================================================

-- Tabela de Odômetros do Veículo (histórico de odômetros)
CREATE TABLE vehicle_odometers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,

  -- Tipo de odômetro
  odometer_type TEXT NOT NULL DEFAULT 'digital' CHECK (odometer_type IN ('analog', 'digital', 'hybrid')),

  -- Unidade de medida
  unit TEXT NOT NULL DEFAULT 'km' CHECK (unit IN ('km', 'mi')),

  -- Capacidade máxima (para odômetros que resetam)
  max_reading INTEGER,

  -- Marca e modelo do odômetro (caso seja aftermarket)
  brand TEXT,
  model TEXT,

  -- Data de instalação
  installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Data de remoção (quando substituído)
  removed_at TIMESTAMPTZ,

  -- Odômetro ativo (apenas um por veículo deve estar ativo)
  active BOOLEAN DEFAULT true,

  -- Motivo da troca/remoção
  removal_reason TEXT,

  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Garante que apenas um odômetro ativo por veículo
  CONSTRAINT unique_active_odometer_per_vehicle UNIQUE NULLS NOT DISTINCT (vehicle_id, active)
);

-- Tabela de Leituras de Odômetro
CREATE TABLE odometer_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_odometer_id UUID NOT NULL REFERENCES vehicle_odometers(id) ON DELETE CASCADE,

  -- Leitura
  reading INTEGER NOT NULL CHECK (reading >= 0),

  -- Data e hora da leitura
  reading_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Fonte da leitura
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN (
    'manual',           -- Entrada manual do usuário
    'photo_ocr',        -- OCR de foto do painel
    'obd_device',       -- Dispositivo OBD conectado
    'gps_tracker',      -- Rastreador GPS
    'workshop',         -- Registrado em oficina
    'fuel_station',     -- Registrado em posto
    'system'            -- Gerado automaticamente pelo sistema
  )),

  -- Tipo de leitura
  reading_type TEXT NOT NULL DEFAULT 'regular' CHECK (reading_type IN (
    'regular',          -- Leitura normal
    'fuel',             -- Durante abastecimento
    'maintenance',      -- Durante manutenção
    'inspection',       -- Durante inspeção
    'accident',         -- Após acidente
    'reset'             -- Após reset do odômetro
  )),

  -- Localização (se disponível)
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,

  -- Quem registrou (entity)
  recorded_by UUID REFERENCES entities(id) ON DELETE SET NULL,

  -- URL da foto/comprovante
  photo_url TEXT,

  -- Observações
  notes TEXT,

  -- Confiabilidade da leitura (0-100)
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),

  -- Flags de validação
  is_validated BOOLEAN DEFAULT false,
  is_suspicious BOOLEAN DEFAULT false, -- Para leituras suspeitas (ex: quilometragem muito baixa)

  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_vehicle_odometers_vehicle ON vehicle_odometers(vehicle_id);
CREATE INDEX idx_vehicle_odometers_active ON vehicle_odometers(active) WHERE active = true;
CREATE INDEX idx_vehicle_odometers_installed_at ON vehicle_odometers(installed_at DESC);

CREATE INDEX idx_odometer_readings_odometer ON odometer_readings(vehicle_odometer_id);
CREATE INDEX idx_odometer_readings_reading_at ON odometer_readings(reading_at DESC);
CREATE INDEX idx_odometer_readings_reading ON odometer_readings(reading DESC);
CREATE INDEX idx_odometer_readings_source ON odometer_readings(source);
CREATE INDEX idx_odometer_readings_type ON odometer_readings(reading_type);
CREATE INDEX idx_odometer_readings_recorded_by ON odometer_readings(recorded_by);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vehicle_odometers_updated_at
  BEFORE UPDATE ON vehicle_odometers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_odometer_readings_updated_at
  BEFORE UPDATE ON odometer_readings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function para detectar leituras suspeitas
CREATE OR REPLACE FUNCTION check_suspicious_odometer_reading()
RETURNS TRIGGER AS $$
DECLARE
  last_reading INTEGER;
  time_diff_hours NUMERIC;
BEGIN
  -- Buscar última leitura do mesmo odômetro
  SELECT reading INTO last_reading
  FROM odometer_readings
  WHERE vehicle_odometer_id = NEW.vehicle_odometer_id
    AND reading_at < NEW.reading_at
  ORDER BY reading_at DESC
  LIMIT 1;

  -- Se houver leitura anterior
  IF last_reading IS NOT NULL THEN
    -- Calcular diferença de tempo em horas
    time_diff_hours := EXTRACT(EPOCH FROM (NEW.reading_at - (
      SELECT reading_at FROM odometer_readings
      WHERE vehicle_odometer_id = NEW.vehicle_odometer_id
        AND reading_at < NEW.reading_at
      ORDER BY reading_at DESC
      LIMIT 1
    ))) / 3600;

    -- Verificar se a quilometragem diminuiu (suspeito)
    IF NEW.reading < last_reading THEN
      NEW.is_suspicious := true;
    -- Verificar se o aumento é muito grande em pouco tempo (>200km/h em média)
    ELSIF time_diff_hours > 0 AND (NEW.reading - last_reading) / time_diff_hours > 200 THEN
      NEW.is_suspicious := true;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para checar leituras suspeitas
CREATE TRIGGER trigger_check_suspicious_odometer_reading
  BEFORE INSERT ON odometer_readings
  FOR EACH ROW
  EXECUTE FUNCTION check_suspicious_odometer_reading();

-- RLS (Row Level Security)
ALTER TABLE vehicle_odometers ENABLE ROW LEVEL SECURITY;
ALTER TABLE odometer_readings ENABLE ROW LEVEL SECURITY;

-- Policies públicas temporárias (para desenvolvimento)
CREATE POLICY "Allow public read vehicle_odometers" ON vehicle_odometers FOR SELECT USING (true);
CREATE POLICY "Allow public insert vehicle_odometers" ON vehicle_odometers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vehicle_odometers" ON vehicle_odometers FOR UPDATE USING (true);

CREATE POLICY "Allow public read odometer_readings" ON odometer_readings FOR SELECT USING (true);
CREATE POLICY "Allow public insert odometer_readings" ON odometer_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update odometer_readings" ON odometer_readings FOR UPDATE USING (true);

-- Comentários para documentação
COMMENT ON TABLE vehicle_odometers IS 'Histórico de odômetros instalados no veículo';
COMMENT ON TABLE odometer_readings IS 'Leituras de quilometragem do odômetro';

COMMENT ON COLUMN vehicle_odometers.odometer_type IS 'Tipo: analog, digital, hybrid';
COMMENT ON COLUMN vehicle_odometers.max_reading IS 'Capacidade máxima antes de resetar (ex: 999999)';
COMMENT ON COLUMN vehicle_odometers.active IS 'Apenas um odômetro ativo por veículo';

COMMENT ON COLUMN odometer_readings.source IS 'Origem: manual, photo_ocr, obd_device, gps_tracker, workshop, fuel_station, system';
COMMENT ON COLUMN odometer_readings.reading_type IS 'Tipo: regular, fuel, maintenance, inspection, accident, reset';
COMMENT ON COLUMN odometer_readings.confidence_score IS 'Confiabilidade da leitura (0-100). Usado para OCR e leituras automáticas';
COMMENT ON COLUMN odometer_readings.is_suspicious IS 'Marca leituras suspeitas (quilometragem diminuiu ou aumentou muito rápido)';
