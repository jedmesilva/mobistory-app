-- =====================================================
-- VEHICLE TANK AND FUELING SYSTEM
-- Sistema de tanques e abastecimentos
-- =====================================================

-- Tabela de Tanques do Veículo (histórico de tanques)
CREATE TABLE vehicle_tanks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,

  -- Capacidade do tanque em litros
  capacity_liters DECIMAL(6, 2) NOT NULL CHECK (capacity_liters > 0),

  -- Tipo de tanque
  tank_type TEXT NOT NULL DEFAULT 'original' CHECK (tank_type IN (
    'original',         -- Tanque original de fábrica
    'aftermarket',      -- Tanque aftermarket
    'auxiliary',        -- Tanque auxiliar adicional
    'modified'          -- Tanque modificado/aumentado
  )),

  -- Material do tanque
  material TEXT CHECK (material IN ('plastic', 'metal', 'aluminum', 'stainless_steel')),

  -- Marca e modelo (se aftermarket)
  brand TEXT,
  model TEXT,

  -- Data de instalação
  installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Data de remoção (quando substituído)
  removed_at TIMESTAMPTZ,

  -- Tanque ativo (apenas um principal por veículo deve estar ativo)
  active BOOLEAN DEFAULT true,

  -- Motivo da troca/remoção
  removal_reason TEXT,

  -- Observações
  notes TEXT,

  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Garante que apenas um tanque ativo principal por veículo
  -- (permite múltiplos auxiliares)
  CONSTRAINT unique_active_tank_per_vehicle
    UNIQUE NULLS NOT DISTINCT (vehicle_id, active, tank_type)
    DEFERRABLE INITIALLY DEFERRED
);

-- Tabela de Abastecimentos
CREATE TABLE fuelings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_tank_id UUID NOT NULL REFERENCES vehicle_tanks(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,

  -- Tipo de combustível (referência à tabela fuels)
  fuel_id UUID REFERENCES fuels(id) ON DELETE SET NULL,

  -- Data e hora do abastecimento
  fueling_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Quantidade abastecida em litros
  liters DECIMAL(6, 3) NOT NULL CHECK (liters > 0),

  -- Preço por litro
  price_per_liter DECIMAL(8, 3) NOT NULL CHECK (price_per_liter > 0),

  -- Total pago
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),

  -- Tanque foi completado?
  is_full_tank BOOLEAN DEFAULT false,

  -- Odômetro no momento do abastecimento
  odometer_reading INTEGER CHECK (odometer_reading >= 0),
  odometer_reading_id UUID REFERENCES odometer_readings(id) ON DELETE SET NULL,

  -- Posto de combustível
  station_name TEXT,
  station_brand TEXT,

  -- Localização
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,

  -- Método de pagamento
  payment_method TEXT CHECK (payment_method IN (
    'cash', 'debit_card', 'credit_card', 'pix', 'voucher', 'app', 'other'
  )),

  -- Quem abasteceu (entity)
  fueled_by UUID REFERENCES entities(id) ON DELETE SET NULL,

  -- URL da nota fiscal / comprovante
  receipt_url TEXT,

  -- Cálculo de consumo (será preenchido automaticamente)
  consumption_km_per_liter DECIMAL(5, 2), -- Calculado entre abastecimentos
  distance_traveled INTEGER, -- Distância desde último abastecimento

  -- Observações
  notes TEXT,

  -- Flags de validação
  is_validated BOOLEAN DEFAULT false,
  is_suspicious BOOLEAN DEFAULT false, -- Para detectar fraudes ou erros

  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_vehicle_tanks_vehicle ON vehicle_tanks(vehicle_id);
CREATE INDEX idx_vehicle_tanks_active ON vehicle_tanks(active) WHERE active = true;
CREATE INDEX idx_vehicle_tanks_type ON vehicle_tanks(tank_type);
CREATE INDEX idx_vehicle_tanks_installed_at ON vehicle_tanks(installed_at DESC);

CREATE INDEX idx_fuelings_vehicle ON fuelings(vehicle_id);
CREATE INDEX idx_fuelings_tank ON fuelings(vehicle_tank_id);
CREATE INDEX idx_fuelings_fuel ON fuelings(fuel_id);
CREATE INDEX idx_fuelings_fueling_at ON fuelings(fueling_at DESC);
CREATE INDEX idx_fuelings_fueled_by ON fuelings(fueled_by);
CREATE INDEX idx_fuelings_station_brand ON fuelings(station_brand);
CREATE INDEX idx_fuelings_payment_method ON fuelings(payment_method);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vehicle_tanks_updated_at
  BEFORE UPDATE ON vehicle_tanks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuelings_updated_at
  BEFORE UPDATE ON fuelings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function para calcular consumo automaticamente
CREATE OR REPLACE FUNCTION calculate_fueling_consumption()
RETURNS TRIGGER AS $$
DECLARE
  last_fueling RECORD;
  distance INTEGER;
BEGIN
  -- Buscar último abastecimento com tanque cheio
  SELECT * INTO last_fueling
  FROM fuelings
  WHERE vehicle_id = NEW.vehicle_id
    AND fueling_at < NEW.fueling_at
    AND is_full_tank = true
    AND odometer_reading IS NOT NULL
  ORDER BY fueling_at DESC
  LIMIT 1;

  -- Se houver abastecimento anterior e ambos têm leitura de odômetro
  IF last_fueling.id IS NOT NULL AND NEW.odometer_reading IS NOT NULL THEN
    -- Calcular distância percorrida
    distance := NEW.odometer_reading - last_fueling.odometer_reading;

    -- Se a distância é positiva
    IF distance > 0 THEN
      NEW.distance_traveled := distance;

      -- Calcular consumo (km/litro)
      -- Considera o combustível do último abastecimento até agora
      IF last_fueling.liters > 0 THEN
        NEW.consumption_km_per_liter := ROUND(
          (distance::DECIMAL / last_fueling.liters)::NUMERIC,
          2
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular consumo
CREATE TRIGGER trigger_calculate_fueling_consumption
  BEFORE INSERT OR UPDATE ON fuelings
  FOR EACH ROW
  WHEN (NEW.odometer_reading IS NOT NULL)
  EXECUTE FUNCTION calculate_fueling_consumption();

-- Function para criar leitura de odômetro ao abastecer
CREATE OR REPLACE FUNCTION create_odometer_reading_on_fueling()
RETURNS TRIGGER AS $$
DECLARE
  active_odometer_id UUID;
BEGIN
  -- Se já tem odometer_reading_id, não criar outro
  IF NEW.odometer_reading_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Se tem leitura mas não tem ID, buscar odômetro ativo
  IF NEW.odometer_reading IS NOT NULL THEN
    SELECT id INTO active_odometer_id
    FROM vehicle_odometers
    WHERE vehicle_id = NEW.vehicle_id
      AND active = true
    LIMIT 1;

    -- Se encontrou odômetro ativo, criar leitura
    IF active_odometer_id IS NOT NULL THEN
      INSERT INTO odometer_readings (
        vehicle_odometer_id,
        reading,
        reading_at,
        source,
        reading_type,
        recorded_by,
        location_lat,
        location_lng,
        location_address
      ) VALUES (
        active_odometer_id,
        NEW.odometer_reading,
        NEW.fueling_at,
        'fuel_station',
        'fuel',
        NEW.fueled_by,
        NEW.location_lat,
        NEW.location_lng,
        NEW.location_address
      )
      RETURNING id INTO NEW.odometer_reading_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar leitura de odômetro
CREATE TRIGGER trigger_create_odometer_reading_on_fueling
  BEFORE INSERT ON fuelings
  FOR EACH ROW
  EXECUTE FUNCTION create_odometer_reading_on_fueling();

-- RLS (Row Level Security)
ALTER TABLE vehicle_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuelings ENABLE ROW LEVEL SECURITY;

-- Policies públicas temporárias (para desenvolvimento)
CREATE POLICY "Allow public read vehicle_tanks" ON vehicle_tanks FOR SELECT USING (true);
CREATE POLICY "Allow public insert vehicle_tanks" ON vehicle_tanks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vehicle_tanks" ON vehicle_tanks FOR UPDATE USING (true);

CREATE POLICY "Allow public read fuelings" ON fuelings FOR SELECT USING (true);
CREATE POLICY "Allow public insert fuelings" ON fuelings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update fuelings" ON fuelings FOR UPDATE USING (true);

-- Comentários para documentação
COMMENT ON TABLE vehicle_tanks IS 'Histórico de tanques de combustível do veículo';
COMMENT ON TABLE fuelings IS 'Histórico de abastecimentos do veículo';

COMMENT ON COLUMN vehicle_tanks.tank_type IS 'Tipo: original, aftermarket, auxiliary, modified';
COMMENT ON COLUMN vehicle_tanks.capacity_liters IS 'Capacidade do tanque em litros';

COMMENT ON COLUMN fuelings.is_full_tank IS 'Se o tanque foi completado (importante para cálculo de consumo)';
COMMENT ON COLUMN fuelings.consumption_km_per_liter IS 'Consumo calculado automaticamente baseado no último abastecimento';
COMMENT ON COLUMN fuelings.distance_traveled IS 'Distância percorrida desde último abastecimento (calculado automaticamente)';
COMMENT ON COLUMN fuelings.payment_method IS 'Método: cash, debit_card, credit_card, pix, voucher, app, other';
