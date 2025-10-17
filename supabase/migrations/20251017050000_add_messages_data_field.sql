-- =====================================================
-- ADD DATA FIELD TO MESSAGES TABLE
-- Para armazenar dados estruturados de insights da AI
-- =====================================================

-- Adicionar campo 'data' para mensagens
ALTER TABLE messages
ADD COLUMN data JSONB DEFAULT '{}'::jsonb;

-- Criar índice para busca eficiente em campos JSONB
CREATE INDEX idx_messages_data ON messages USING GIN (data);

-- Comentário explicativo
COMMENT ON COLUMN messages.data IS 'Dados estruturados da mensagem (insights, análises, estatísticas, etc). Usado principalmente para mensagens da AI com informações sobre o veículo.';
