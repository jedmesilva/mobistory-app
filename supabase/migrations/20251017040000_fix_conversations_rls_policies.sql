-- =====================================================
-- FIX RLS POLICIES FOR CONVERSATIONS AND MESSAGES
-- Permite acesso público temporariamente (desenvolvimento)
-- =====================================================

-- Drop policies antigas
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

-- Policies temporárias para desenvolvimento (acesso público)
-- TODO: Substituir por policies com auth quando implementar autenticação

-- Conversations: Qualquer pessoa pode criar
CREATE POLICY "Allow public insert conversations" ON conversations
  FOR INSERT
  WITH CHECK (true);

-- Conversations: Qualquer pessoa pode atualizar
CREATE POLICY "Allow public update conversations" ON conversations
  FOR UPDATE
  USING (true);

-- Messages: Qualquer pessoa pode criar
CREATE POLICY "Allow public insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Messages: Qualquer pessoa pode atualizar
CREATE POLICY "Allow public update messages" ON messages
  FOR UPDATE
  USING (true);
