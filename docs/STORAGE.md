# Estrutura de Storage - Mobistory

Este documento descreve a estrutura completa de armazenamento de arquivos do Mobistory usando Supabase Storage.

## Visão Geral

O sistema utiliza **4 buckets** especializados para organizar diferentes tipos de arquivos:

| Bucket | Propósito | Acesso | Limite | Cache |
|--------|-----------|--------|--------|-------|
| `vehicle-profiles` | Fotos de perfil e avatares | Público | 5MB | 1 ano |
| `vehicle-moments` | Posts e timeline | Semi-público | 50MB | 1 mês |
| `conversation-media` | Arquivos de chat | Privado | 100MB | 1 semana |
| `vehicle-data` | Documentos oficiais | Privado | 50MB | Sem cache |

---

## 1. vehicle-profiles

**Propósito:** Armazenar fotos de perfil e capas dos veículos.

### Estrutura de Pastas:

```
vehicle-profiles/
├── {vehicle-id}/
│   ├── avatar.jpg       # 200x200 - Usado em listas e cards
│   ├── cover.jpg        # 1200x400 - Banner do perfil (opcional)
│   ├── medium.jpg       # 800x800 - Perfil completo
│   └── original.jpg     # Backup em alta resolução
```

### Características:
- ✅ **Acesso público** para leitura
- ✅ **Upload restrito** a donos/admins do veículo
- ✅ **Cache agressivo** (1 ano)
- ✅ **Otimização automática** de imagens
- ✅ **Limite:** 5MB por arquivo

### Tipos de Arquivo Permitidos:
- `image/jpeg`
- `image/png`
- `image/webp`

### Exemplo de Uso:

```typescript
import { uploadVehicleProfilePhoto } from '@/lib/storage';

// Upload de foto de perfil
const result = await uploadVehicleProfilePhoto(
  'vehicle-123',
  'file:///path/to/photo.jpg'
);

console.log(result.url); // URL pública do avatar
```

### Usando o Hook:

```typescript
import { useVehicleProfileUpload } from '@/hooks/useVehicleProfileUpload';

function MyComponent() {
  const { pickAndUploadProfilePhoto, uploadState } = useVehicleProfileUpload();

  const handleUpload = async () => {
    const url = await pickAndUploadProfilePhoto('vehicle-123');
    console.log('Uploaded:', url);
  };

  return (
    <Button onPress={handleUpload} disabled={uploadState.isUploading}>
      {uploadState.isUploading ? 'Uploading...' : 'Upload Photo'}
    </Button>
  );
}
```

### Usando o Componente:

```typescript
import { VehicleProfilePhotoUpload } from '@/components/vehicle';

function VehicleProfileScreen() {
  return (
    <VehicleProfilePhotoUpload
      vehicleId="vehicle-123"
      currentPhotoUrl="https://..."
      onUploadSuccess={(url) => console.log('New photo:', url)}
      size={120}
    />
  );
}
```

---

## 2. vehicle-moments

**Propósito:** Armazenar fotos e vídeos dos momentos (posts) da timeline do veículo.

### Estrutura de Pastas:

```
vehicle-moments/
├── {vehicle-id}/
│   └── {moment-id}/
│       ├── original/           # Mídia original em alta qualidade
│       │   ├── photo-1.jpg
│       │   ├── photo-2.jpg
│       │   └── video-1.mp4
│       ├── web/                # Versões otimizadas para web
│       │   ├── photo-1.jpg     # 1024x1024
│       │   ├── photo-2.jpg
│       │   └── video-1-720p.mp4
│       └── thumb/              # Miniaturas para preview
│           ├── photo-1.jpg     # 300x300
│           ├── photo-2.jpg
│           └── video-1.jpg
```

### Características:
- ✅ **Acesso baseado em permissões** do veículo
- ✅ **Suporte a múltiplas mídias** por momento
- ✅ **Otimização automática** de imagens
- ✅ **Cache médio** (1 mês)
- ✅ **Limite:** 50MB por arquivo

### Tipos de Arquivo Permitidos:
- Imagens: `image/jpeg`, `image/png`, `image/webp`, `image/heic`
- Vídeos: `video/mp4`, `video/quicktime`, `video/x-msvideo`

### Exemplo de Uso:

```typescript
import { uploadMomentMedia } from '@/lib/storage';

// Upload de foto para um momento
const result = await uploadMomentMedia(
  'vehicle-123',
  'moment-456',
  'file:///path/to/photo.jpg',
  'image',
  0 // índice da foto
);

console.log(result.url); // URL da versão web
```

---

## 3. conversation-media

**Propósito:** Armazenar arquivos compartilhados em conversas entre entidades e veículos.

### Estrutura de Pastas:

```
conversation-media/
├── {conversation-id}/
│   ├── 1705849200000-photo.jpg
│   ├── 1705849300000-document.pdf
│   ├── 1705849400000-video.mp4
│   └── 1705849500000-audio.m4a
```

### Características:
- ✅ **Acesso privado** apenas para participantes da conversa
- ✅ **Suporte a múltiplos tipos** de arquivo
- ✅ **Timestamp no nome** para organização
- ✅ **Cache curto** (1 semana)
- ✅ **Limite:** 100MB por arquivo

### Tipos de Arquivo Permitidos:
- Imagens: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/heic`
- Vídeos: `video/mp4`, `video/quicktime`, `video/x-msvideo`
- Áudio: `audio/mpeg`, `audio/mp4`, `audio/wav`, `audio/x-m4a`
- Documentos: `application/pdf`, `text/plain`, `text/csv`
- Office: `application/msword`, `application/vnd.openxmlformats-officedocument.*`

### Exemplo de Uso:

```typescript
import { uploadConversationMedia } from '@/lib/storage';

// Upload de arquivo de conversa
const result = await uploadConversationMedia(
  'conversation-789',
  'file:///path/to/document.pdf',
  'document',
  'contract.pdf'
);

console.log(result.url); // URL do arquivo
```

---

## 4. vehicle-data

**Propósito:** Armazenar documentos oficiais e de propriedade do veículo.

### Estrutura de Pastas:

```
vehicle-data/
├── {vehicle-id}/
│   ├── documents/              # Documentos oficiais do veículo
│   │   ├── crlv.pdf
│   │   ├── manual.pdf
│   │   └── inspection-2025-01-15.pdf
│   └── ownership/              # Documentos de propriedade/vínculo
│       └── {entity-id}/
│           ├── contract.pdf
│           ├── proof-of-purchase.pdf
│           └── transfer-documents.pdf
```

### Características:
- ✅ **Acesso privado** para usuários vinculados
- ✅ **Organização por tipo** de documento
- ✅ **Sem cache** (documentos sensíveis)
- ✅ **Limite:** 50MB por arquivo

### Tipos de Arquivo Permitidos:
- Documentos: `application/pdf`, `text/plain`
- Imagens: `image/jpeg`, `image/png`, `image/webp`
- Office: `application/msword`, `application/vnd.openxmlformats-officedocument.*`

### Exemplo de Uso:

```typescript
import { uploadVehicleDocument } from '@/lib/storage';

// Upload de documento oficial
const result1 = await uploadVehicleDocument(
  'vehicle-123',
  'documents',
  'crlv.pdf',
  'file:///path/to/crlv.pdf'
);

// Upload de documento de propriedade
const result2 = await uploadVehicleDocument(
  'vehicle-123',
  'ownership',
  'contract.pdf',
  'file:///path/to/contract.pdf',
  'entity-456' // ID da entidade
);
```

---

## Políticas de Segurança (RLS)

As políticas de RLS (Row Level Security) serão aplicadas após a criação das tabelas necessárias. Elas garantem que:

### vehicle-profiles:
- ✅ Todos podem **ler**
- ✅ Apenas donos/admins podem **criar/atualizar**
- ✅ Apenas donos podem **deletar**

### vehicle-moments:
- ✅ Leitura baseada na **visibilidade do veículo**
- ✅ Upload por **usuários vinculados**
- ✅ Atualização/exclusão pelo **criador** ou **donos do veículo**

### conversation-media:
- ✅ Acesso apenas para **participantes da conversa**
- ✅ Upload por **participantes ativos**
- ✅ Exclusão apenas pelo **autor do arquivo**

### vehicle-data:
- ✅ Acesso apenas para **usuários vinculados** ao veículo
- ✅ Upload de docs oficiais por **donos/admins**
- ✅ Upload de docs de propriedade pela **própria entidade**

---

## Funções Utilitárias

### Listar Arquivos:

```typescript
import { listFiles } from '@/lib/storage';

const files = await listFiles('vehicle-moments', 'vehicle-123/moment-456/original');
console.log(files); // ['photo-1.jpg', 'photo-2.jpg', 'video-1.mp4']
```

### Deletar Arquivo:

```typescript
import { deleteFile } from '@/lib/storage';

const success = await deleteFile('vehicle-moments', 'vehicle-123/moment-456/original/photo-1.jpg');
console.log(success); // true
```

### Obter URL Pública:

```typescript
import { getPublicUrl } from '@/lib/storage';

const url = getPublicUrl('vehicle-profiles', 'vehicle-123/avatar.jpg');
console.log(url); // https://...
```

### Obter URL Assinada (Privada):

```typescript
import { getSignedUrl } from '@/lib/storage';

const url = await getSignedUrl('vehicle-data', 'vehicle-123/documents/crlv.pdf', 3600);
console.log(url); // URL temporária válida por 1 hora
```

---

## Migrações

As migrações estão localizadas em:
- `supabase/migrations/20250121_create_storage_buckets.sql` - Criação dos buckets ✅
- `supabase/migrations/_pending_20250121_create_storage_policies.sql` - Políticas RLS (pendente)

Para aplicar as migrações:

```bash
npx supabase db push --include-all
```

---

## Próximos Passos

1. ✅ Criar buckets no Supabase
2. ⏳ Criar tabelas necessárias (vehicles, moments, conversations, etc)
3. ⏳ Aplicar políticas de RLS
4. ⏳ Implementar pipeline de processamento de vídeos
5. ⏳ Configurar CDN (Cloudflare) para vehicle-moments

---

## Suporte

Para dúvidas sobre a estrutura de storage, consulte:
- Documentação do Supabase Storage: https://supabase.com/docs/guides/storage
- Código-fonte: `lib/storage.ts`
- Hooks: `hooks/useVehicleProfileUpload.ts`
- Componentes: `components/vehicle/VehicleProfilePhotoUpload.tsx`
