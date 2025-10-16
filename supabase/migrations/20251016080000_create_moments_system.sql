-- =====================================================
-- MOMENTS SYSTEM (Posts do Veículo)
-- =====================================================

-- Tabela de Momentos (Posts)
CREATE TABLE moments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  -- Conteúdo
  caption TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'text')),

  -- Metadados opcionais
  location TEXT,
  tags JSONB DEFAULT '[]'::jsonb,

  -- Controle
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Imagens do Momento
CREATE TABLE moment_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,

  -- Metadados da imagem
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Reações aos Momentos
CREATE TABLE moment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  reaction_type TEXT NOT NULL DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'care', 'wow', 'sad', 'angry')),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Garante uma reação por entidade por momento
  CONSTRAINT unique_reaction_per_entity UNIQUE(moment_id, entity_id)
);

-- Tabela de Comentários nos Momentos
CREATE TABLE moment_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  moment_id UUID NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

  comment TEXT NOT NULL,

  -- Para respostas a comentários
  parent_comment_id UUID REFERENCES moment_comments(id) ON DELETE CASCADE,

  -- Controle
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Imagens do Veículo
CREATE TABLE vehicle_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,

  -- Metadados da imagem
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Garante apenas uma imagem primária por veículo
  CONSTRAINT unique_primary_image EXCLUDE (vehicle_id WITH =) WHERE (is_primary = true)
);

-- Índices para performance
CREATE INDEX idx_moments_vehicle ON moments(vehicle_id);
CREATE INDEX idx_moments_entity ON moments(entity_id);
CREATE INDEX idx_moments_created ON moments(created_at DESC);
CREATE INDEX idx_moments_active ON moments(active);

CREATE INDEX idx_moment_images_moment ON moment_images(moment_id);
CREATE INDEX idx_moment_images_order ON moment_images(moment_id, image_order);

CREATE INDEX idx_moment_reactions_moment ON moment_reactions(moment_id);
CREATE INDEX idx_moment_reactions_entity ON moment_reactions(entity_id);

CREATE INDEX idx_moment_comments_moment ON moment_comments(moment_id);
CREATE INDEX idx_moment_comments_entity ON moment_comments(entity_id);
CREATE INDEX idx_moment_comments_parent ON moment_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;
CREATE INDEX idx_moment_comments_created ON moment_comments(created_at DESC);

CREATE INDEX idx_vehicle_images_vehicle ON vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_primary ON vehicle_images(vehicle_id, is_primary);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_moments_updated_at
  BEFORE UPDATE ON moments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moment_comments_updated_at
  BEFORE UPDATE ON moment_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;

-- Policies: Por enquanto permitir leitura pública
CREATE POLICY "Allow public read moments" ON moments FOR SELECT USING (true);
CREATE POLICY "Allow public read moment_images" ON moment_images FOR SELECT USING (true);
CREATE POLICY "Allow public read moment_reactions" ON moment_reactions FOR SELECT USING (true);
CREATE POLICY "Allow public read moment_comments" ON moment_comments FOR SELECT USING (true);
CREATE POLICY "Allow public read vehicle_images" ON vehicle_images FOR SELECT USING (true);

-- Policies: Usuários autenticados podem criar
CREATE POLICY "Authenticated users can create moments" ON moments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create moment_reactions" ON moment_reactions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create moment_comments" ON moment_comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload vehicle_images" ON vehicle_images
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policies: Usuários podem atualizar seus próprios conteúdos
CREATE POLICY "Users can update their own moments" ON moments
  FOR UPDATE
  USING (entity_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own moments" ON moments
  FOR DELETE
  USING (entity_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own comments" ON moment_comments
  FOR UPDATE
  USING (entity_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own comments" ON moment_comments
  FOR DELETE
  USING (entity_id IN (SELECT id FROM entities WHERE auth_user_id = auth.uid()));

-- Comentários para documentação
COMMENT ON TABLE moments IS 'Posts/momentos dos veículos criados por entidades vinculadas';
COMMENT ON TABLE moment_images IS 'Múltiplas imagens de um momento';
COMMENT ON TABLE moment_reactions IS 'Reações (curtidas, etc) aos momentos';
COMMENT ON TABLE moment_comments IS 'Comentários nos momentos, com suporte a respostas';
COMMENT ON TABLE vehicle_images IS 'Imagens do veículo, incluindo imagem de perfil';

COMMENT ON COLUMN moments.type IS 'Tipo do momento: image, video, text';
COMMENT ON COLUMN moments.tags IS 'Tags do momento em formato JSON array';
COMMENT ON COLUMN moment_reactions.reaction_type IS 'Tipo de reação: like, love, care, wow, sad, angry';
COMMENT ON COLUMN moment_comments.parent_comment_id IS 'ID do comentário pai para respostas';
COMMENT ON COLUMN vehicle_images.is_primary IS 'Define se é a imagem de perfil do veículo';
