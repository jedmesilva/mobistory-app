-- =====================================================
-- CONVERSATIONS AND MESSAGES SYSTEM
-- =====================================================

-- Tabela de Conversas (entre entidade e veículo)
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  -- Título da conversa (opcional, pode ser auto-gerado)
  title TEXT,

  -- Status da conversa
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),

  -- Última mensagem (desnormalizado para performance)
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,

  -- Contador de mensagens não lidas por entidade
  unread_count INTEGER DEFAULT 0,

  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Controle
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Garante que não haja conversas duplicadas entre a mesma entidade e veículo
  CONSTRAINT unique_entity_vehicle_conversation UNIQUE(vehicle_id, entity_id)
);

-- Tabela de Mensagens
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Remetente (entity que enviou a mensagem)
  sender_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  -- Tipo de mensagem
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN (
    'text', 'image', 'video', 'audio', 'file', 'location', 'system'
  )),

  -- Conteúdo
  content TEXT,

  -- Arquivos/mídia (URLs)
  media_urls JSONB DEFAULT '[]'::jsonb,

  -- Metadados (localização, duração de áudio, etc)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Status da mensagem
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN (
    'sending', 'sent', 'delivered', 'read', 'failed'
  )),

  -- Timestamps de status
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,

  -- Resposta a outra mensagem (threading)
  reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,

  -- Reações (emojis)
  reactions JSONB DEFAULT '[]'::jsonb,

  -- Mensagem editada
  edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,

  -- Mensagem deletada (soft delete)
  deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,

  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_conversations_vehicle ON conversations(vehicle_id);
CREATE INDEX idx_conversations_entity ON conversations(entity_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_active ON conversations(active);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_type ON messages(message_type);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_reply_to ON messages(reply_to_message_id) WHERE reply_to_message_id IS NOT NULL;
CREATE INDEX idx_messages_deleted ON messages(deleted);

-- Trigger para atualizar updated_at em conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function para atualizar last_message na conversa quando nova mensagem é criada
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza a conversa com a última mensagem
  UPDATE conversations
  SET
    last_message_at = NEW.created_at,
    last_message_preview = CASE
      WHEN NEW.message_type = 'text' THEN LEFT(NEW.content, 100)
      WHEN NEW.message_type = 'image' THEN '📷 Imagem'
      WHEN NEW.message_type = 'video' THEN '🎥 Vídeo'
      WHEN NEW.message_type = 'audio' THEN '🎵 Áudio'
      WHEN NEW.message_type = 'file' THEN '📎 Arquivo'
      WHEN NEW.message_type = 'location' THEN '📍 Localização'
      WHEN NEW.message_type = 'system' THEN '🔔 ' || LEFT(NEW.content, 100)
      ELSE NEW.content
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para chamar a function acima
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON messages
  FOR EACH ROW
  WHEN (NEW.deleted = false)
  EXECUTE FUNCTION update_conversation_last_message();

-- Function para incrementar unread_count
CREATE OR REPLACE FUNCTION increment_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Incrementa o contador de não lidas para o destinatário
  UPDATE conversations
  SET unread_count = unread_count + 1
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para incrementar unread quando nova mensagem chega
CREATE TRIGGER trigger_increment_unread_count
  AFTER INSERT ON messages
  FOR EACH ROW
  WHEN (NEW.deleted = false AND NEW.message_type != 'system')
  EXECUTE FUNCTION increment_unread_count();

-- RLS (Row Level Security)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies: Leitura pública (ajustaremos depois com auth)
CREATE POLICY "Allow public read conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow public read messages" ON messages FOR SELECT USING (true);

-- Policy: Usuários autenticados podem criar conversas
CREATE POLICY "Authenticated users can create conversations" ON conversations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Usuários podem atualizar suas próprias conversas
CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE
  USING (entity_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

-- Policy: Usuários autenticados podem enviar mensagens
CREATE POLICY "Authenticated users can send messages" ON messages
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Usuários podem atualizar suas próprias mensagens (editar, deletar)
CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE
  USING (sender_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

-- Comentários para documentação
COMMENT ON TABLE conversations IS 'Conversas entre entidades e veículos para sistema de mensagens';
COMMENT ON TABLE messages IS 'Mensagens dentro das conversas';

COMMENT ON COLUMN conversations.last_message_preview IS 'Preview da última mensagem para lista de conversas (desnormalizado)';
COMMENT ON COLUMN conversations.unread_count IS 'Contador de mensagens não lidas pela entidade';
COMMENT ON COLUMN conversations.metadata IS 'Dados adicionais (preferências, configurações, etc)';

COMMENT ON COLUMN messages.message_type IS 'Tipo: text, image, video, audio, file, location, system';
COMMENT ON COLUMN messages.status IS 'Status: sending, sent, delivered, read, failed';
COMMENT ON COLUMN messages.reactions IS 'Array de reações (emojis) com entity_id e emoji';
COMMENT ON COLUMN messages.reply_to_message_id IS 'ID da mensagem sendo respondida (threading)';
