-- Migration: Create conversation_contexts table
-- Description: Tabela para organizar mensagens de conversas por contexto
-- Author: Claude Code
-- Date: 2025-10-22

-- Create conversation_contexts table
CREATE TABLE IF NOT EXISTS conversation_contexts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Tipo e status do contexto
  context_type TEXT NOT NULL CHECK (context_type IN (
    'fueling',
    'maintenance',
    'odometer',
    'vehicle_update',
    'vehicle_register',
    'document',
    'insurance',
    'issue',
    'general'
  )),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',      -- IA identificou, aguarda confirmação
    'confirmed',  -- Usuário confirmou
    'completed',  -- Contexto finalizado (registro criado)
    'cancelled'   -- Usuário cancelou
  )),

  -- Informações do contexto
  title TEXT,
  summary TEXT,

  -- Metadata específico por tipo de contexto (JSONB para flexibilidade)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Hint inicial que veio da origem da mensagem
  context_hint TEXT,

  -- Confiança da IA na identificação do contexto (0.00 a 1.00)
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),

  -- Confirmação do usuário
  confirmed_by_user BOOLEAN DEFAULT false,

  -- Timestamps importantes
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Data de início do contexto
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ, -- Quando o contexto foi finalizado

  -- Soft delete
  active BOOLEAN DEFAULT true
);

-- Índices para performance
CREATE INDEX idx_contexts_conversation ON conversation_contexts(conversation_id);
CREATE INDEX idx_contexts_type ON conversation_contexts(context_type);
CREATE INDEX idx_contexts_status ON conversation_contexts(status);
CREATE INDEX idx_contexts_active ON conversation_contexts(active);
CREATE INDEX idx_contexts_started_at ON conversation_contexts(started_at DESC);

-- Adicionar coluna context_id na tabela messages
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS context_id UUID REFERENCES conversation_contexts(id) ON DELETE SET NULL;

-- Adicionar coluna context_hint na tabela messages (hint enviado pelo cliente)
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS context_hint TEXT;

-- Índice para buscar mensagens por contexto
CREATE INDEX IF NOT EXISTS idx_messages_context ON messages(context_id);
CREATE INDEX IF NOT EXISTS idx_messages_context_hint ON messages(context_hint) WHERE context_hint IS NOT NULL;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_conversation_contexts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_conversation_contexts_updated_at
  BEFORE UPDATE ON conversation_contexts
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_contexts_updated_at();

-- Comentários para documentação
COMMENT ON TABLE conversation_contexts IS 'Contextos das conversas para agrupar mensagens relacionadas';
COMMENT ON COLUMN conversation_contexts.context_type IS 'Tipo do contexto: fueling, maintenance, odometer, etc';
COMMENT ON COLUMN conversation_contexts.status IS 'Status: draft, confirmed, completed, cancelled';
COMMENT ON COLUMN conversation_contexts.metadata IS 'Dados específicos do contexto em formato JSON';
COMMENT ON COLUMN conversation_contexts.ai_confidence IS 'Nível de confiança da IA (0.00 a 1.00)';
COMMENT ON COLUMN conversation_contexts.started_at IS 'Data e hora de início do contexto';
COMMENT ON COLUMN conversation_contexts.completed_at IS 'Data e hora de finalização do contexto';

-- RLS (Row Level Security)
ALTER TABLE conversation_contexts ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver contextos de suas próprias conversas
CREATE POLICY "Users can view their conversation contexts"
  ON conversation_contexts
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE entity_id = auth.uid()
    )
  );

-- Policy: Usuários podem criar contextos em suas conversas
CREATE POLICY "Users can create conversation contexts"
  ON conversation_contexts
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE entity_id = auth.uid()
    )
  );

-- Policy: Usuários podem atualizar contextos de suas conversas
CREATE POLICY "Users can update their conversation contexts"
  ON conversation_contexts
  FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE entity_id = auth.uid()
    )
  );

-- Policy: Usuários podem deletar (soft delete) contextos de suas conversas
CREATE POLICY "Users can delete their conversation contexts"
  ON conversation_contexts
  FOR DELETE
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE entity_id = auth.uid()
    )
  );
