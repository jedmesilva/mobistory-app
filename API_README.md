# 🔌 API Integration - Quick Start

## ✅ Integração Completa com Backend FastAPI

A camada de integração com o backend está **100% implementada** e pronta para uso!

---

## 📦 O que foi implementado:

### 1. Configuração Base (`lib/api/`)
- ✅ **config.ts** - Axios configurado com interceptors para JWT
- ✅ **types.ts** - Todos os tipos TypeScript para API
- ✅ **tokenManager** - Gerenciamento automático de tokens

### 2. Serviços (`lib/api/services/`)
- ✅ **authService** - Login, registro, logout
- ✅ **vehiclesService** - CRUD de veículos
- ✅ **catalogService** - Brands, models, versions
- ✅ **conversationsService** - CRUD de conversas
- ✅ **messagesService** - CRUD de mensagens
- ✅ **fuelingService** - CRUD de abastecimentos + estatísticas
- ✅ **maintenanceService** - CRUD de manutenções + estatísticas
- ✅ **uploadService** - Upload de imagens/áudio/vídeo
- ✅ **ChatWebSocket** - WebSocket para chat em tempo real

### 3. React Hooks (`lib/api/hooks/`)
- ✅ **useAuth** - Hook de autenticação
- ✅ **useVehicles** - Hook de veículos
- ✅ **useCatalog** - Hook de catálogo
- ✅ **useConversations** - Hook de conversas
- ✅ **useMessages** - Hook de mensagens
- ✅ **useFueling** - Hook de abastecimentos
- ✅ **useMaintenance** - Hook de manutenções
- ✅ **useChatWebSocket** - Hook de WebSocket

### 4. Contexto Global
- ✅ **AuthProvider** - Contexto de autenticação para todo o app

### 5. Documentação
- ✅ **API_INTEGRATION.md** - Guia completo com exemplos

---

## 🚀 Como Usar

### 1. Iniciar Backend
```bash
cd ../mobistory-backend
docker-compose up -d
uvicorn app.main:app --reload
```

Backend estará em: `http://localhost:8000`

### 2. Configurar URL (se necessário)

Para testar em dispositivo físico, edite `lib/api/config.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:8000/api/v1'  // Seu IP local
  : 'https://api.mobistory.com/api/v1';
```

### 3. Adicionar AuthProvider

Edite `app/_layout.tsx`:

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Resto do app */}
    </AuthProvider>
  );
}
```

### 4. Usar nos Componentes

```tsx
import { useAuthContext } from '@/contexts/AuthContext';
import { useVehicles, useFueling } from '@/lib/api/hooks';

function MyScreen() {
  const { user, login, logout } = useAuthContext();
  const { vehicles, loading } = useVehicles();
  const { fuelings, createFueling } = useFueling({ vehicleId: 'vehicle-id' });

  // Use os hooks...
}
```

---

## 📚 Exemplos Rápidos

### Login
```tsx
const { login } = useAuthContext();
await login({ email: 'user@example.com', password: 'senha123' });
```

### Listar Veículos
```tsx
const { vehicles, loading } = useVehicles();
```

### Chat em Tempo Real
```tsx
const { messages, sendMessage } = useChatWebSocket(conversationId);
sendMessage('Hello!', 'text');
```

### Registrar Abastecimento
```tsx
const { createFueling } = useFueling();
await createFueling({
  vehicle_id: vehicleId,
  date: '2025-10-22',
  fuel_type: 'gasolina',
  liters: 45.5,
  price_per_liter: 6.20,
  total_price: 282.10,
});
```

### Upload de Imagem
```tsx
import { uploadService } from '@/lib/api';

const result = await uploadService.uploadFile({
  uri: imageUri,
  name: 'photo.jpg',
  type: 'image/jpeg',
});

console.log('URL:', uploadService.getFileUrl(result.stored_filename));
```

---

## 📖 Documentação Completa

Ver `docs/API_INTEGRATION.md` para exemplos detalhados de:
- Autenticação completa
- CRUD de veículos
- Chat com WebSocket
- Abastecimentos e manutenções
- Upload de arquivos
- Tratamento de erros
- TypeScript types

---

## 🎯 Estrutura Criada

```
lib/api/
├── config.ts                # Axios + token manager
├── types.ts                 # TypeScript types
├── services/                # 8 serviços implementados
│   ├── auth.ts
│   ├── vehicles.ts
│   ├── conversations.ts
│   ├── fueling.ts
│   ├── maintenance.ts
│   ├── upload.ts
│   ├── websocket.ts
│   └── index.ts
├── hooks/                   # 7 hooks customizados
│   ├── useAuth.ts
│   ├── useVehicles.ts
│   ├── useConversations.ts
│   ├── useFueling.ts
│   ├── useMaintenance.ts
│   ├── useChatWebSocket.ts
│   └── index.ts
└── index.ts

contexts/
└── AuthContext.tsx          # Contexto global de auth

docs/
└── API_INTEGRATION.md       # Documentação completa
```

---

## ✅ Features Implementadas

- ✅ Autenticação JWT automática
- ✅ Token refresh em 401
- ✅ WebSocket com reconexão automática
- ✅ Upload de múltiplos arquivos
- ✅ Filtros avançados (data, tipo, veículo)
- ✅ Estatísticas automáticas
- ✅ TypeScript completo
- ✅ React Hooks para todas as features
- ✅ Contexto global de autenticação
- ✅ Tratamento de erros
- ✅ Loading states

---

## 🔗 Recursos

- **Backend**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **Backend Repo**: https://github.com/jedmesilva/mobistory-backend
- **Documentação Backend**: Ver `mobistory-backend/API_COMPLETE.md`

---

## 🎉 Pronto para Uso!

A integração está completa. Agora você pode:

1. Substituir dados mockados por chamadas reais da API
2. Implementar telas de login/registro
3. Conectar chat ao WebSocket
4. Testar upload de fotos
5. Integrar fluxos de abastecimento e manutenção

Ver `docs/API_INTEGRATION.md` para guia completo!

---

**Última atualização**: 2025-10-22
