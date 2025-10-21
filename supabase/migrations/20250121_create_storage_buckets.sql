-- ============================================================================
-- CRIAÇÃO DOS BUCKETS DE STORAGE
-- ============================================================================
-- Arquivo: 20250121_create_storage_buckets.sql
-- Descrição: Cria os buckets de armazenamento para o sistema Mobistory
-- ============================================================================

-- 1. BUCKET: vehicle-profiles
-- Propósito: Fotos de perfil e avatares dos veículos
-- Acesso: Público para leitura, restrito para escrita
-- Cache: 1 ano (31536000 segundos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-profiles',
  'vehicle-profiles',
  true, -- público para leitura
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. BUCKET: vehicle-moments
-- Propósito: Posts e momentos da timeline do veículo
-- Acesso: Semi-público (depende de permissões do veículo)
-- Cache: 1 mês (2592000 segundos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-moments',
  'vehicle-moments',
  false, -- privado por padrão, controle via RLS
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO NOTHING;

-- 3. BUCKET: conversation-media
-- Propósito: Arquivos compartilhados em conversas
-- Acesso: Privado (apenas participantes da conversa)
-- Cache: 1 semana (604800 segundos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'conversation-media',
  'conversation-media',
  false, -- privado
  104857600, -- 100MB limit
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic',
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-m4a'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 4. BUCKET: vehicle-data
-- Propósito: Documentos oficiais e de propriedade do veículo
-- Acesso: Privado (apenas donos/admins do veículo)
-- Cache: Sem cache (documentos sensíveis)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-data',
  'vehicle-data',
  false, -- privado
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg', 'image/png', 'image/webp',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

-- Documentação da estrutura de pastas
--
-- vehicle-profiles:
--   {vehicle-id}/
--     ├── avatar.jpg       (200x200 - listas e cards)
--     ├── cover.jpg        (1200x400 - banner opcional)
--     ├── medium.jpg       (800x800 - perfil completo)
--     └── original.jpg     (backup em alta resolução)
--
-- vehicle-moments:
--   {vehicle-id}/
--     └── {moment-id}/
--         ├── original/
--         │   ├── photo-1.jpg
--         │   └── video-1.mp4
--         ├── web/
--         │   ├── photo-1-800.jpg
--         │   └── video-1-720p.mp4
--         └── thumb/
--             ├── photo-1-thumb.jpg
--             └── video-1-thumb.jpg
--
-- conversation-media:
--   {conversation-id}/
--     ├── {timestamp}-{filename}.jpg
--     ├── {timestamp}-{filename}.mp4
--     └── {timestamp}-{filename}.pdf
--
-- vehicle-data:
--   {vehicle-id}/
--     ├── documents/
--     │   ├── crlv.pdf
--     │   └── manual.pdf
--     └── ownership/
--         └── {entity-id}/
--             └── contract.pdf
