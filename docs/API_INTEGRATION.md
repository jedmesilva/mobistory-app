# 🔌 Integração com API Backend - Mobistory App

## 📋 Visão Geral

Este documento explica como usar a camada de integração com o backend FastAPI no aplicativo React Native.

---

## 🏗️ Estrutura

```
lib/api/
├── config.ts                    # Configuração do axios e token manager
├── types.ts                     # TypeScript types para toda API
├── services/                    # Serviços para cada recurso
│   ├── auth.ts                  # Autenticação
│   ├── vehicles.ts              # Veículos e catálogo
│   ├── conversations.ts         # Conversas e mensagens
│   ├── fueling.ts               # Abastecimentos
│   ├── maintenance.ts           # Manutenções
│   ├── upload.ts                # Upload de arquivos
│   ├── websocket.ts             # WebSocket para chat
│   └── index.ts                 # Export todos os serviços
├── hooks/                       # React hooks customizados
│   ├── useAuth.ts               # Hook de autenticação
│   ├── useVehicles.ts           # Hook de veículos
│   ├── useConversations.ts      # Hook de conversas
│   ├── useFueling.ts            # Hook de abastecimentos
│   ├── useMaintenance.ts        # Hook de manutenções
│   ├── useChatWebSocket.ts      # Hook de WebSocket
│   └── index.ts                 # Export todos os hooks
└── index.ts                     # Export tudo

contexts/
└── AuthContext.tsx              # Contexto global de autenticação
```

---

## 🚀 Início Rápido

### 1. Configurar URL do Backend

Em `lib/api/config.ts`, a URL já está configurada:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:8000/api/v1'  // Desenvolvimento
  : 'https://api.mobistory.com/api/v1'; // Produção
```

Para testar no dispositivo físico, substitua `localhost` pelo IP da sua máquina:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:8000/api/v1'  // Seu IP local
  : 'https://api.mobistory.com/api/v1';
```

### 2. Adicionar AuthProvider no App

Envolva o app com o `AuthProvider`:

```tsx
// app/_layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Resto do app */}
    </AuthProvider>
  );
}
```

---

## 📚 Exemplos de Uso

### 🔐 Autenticação

#### Usando o Contexto (Recomendado)

```tsx
import { useAuthContext } from '@/contexts/AuthContext';

function LoginScreen() {
  const { login, loading, error } = useAuthContext();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'senha123',
      });
      // Navegar para home
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
      {error && <Text>{error}</Text>}
    </View>
  );
}
```

#### Verificar Se Está Autenticado

```tsx
import { useAuthContext } from '@/contexts/AuthContext';

function ProtectedScreen() {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    // Redirecionar para login
    return <Redirect href="/login" />;
  }

  return <Text>Welcome, {user?.full_name}!</Text>;
}
```

#### Logout

```tsx
const { logout } = useAuthContext();

const handleLogout = async () => {
  await logout();
  // Navegar para login
};
```

### 🚗 Veículos

#### Listar Veículos do Usuário

```tsx
import { useVehicles } from '@/lib/api/hooks';

function VehiclesScreen() {
  const { vehicles, loading, error, loadVehicles } = useVehicles();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={vehicles}
      renderItem={({ item }) => (
        <View>
          <Text>{item.brand?.brand} {item.model?.model}</Text>
          <Text>{item.version?.version} - {item.year}</Text>
          {item.nickname && <Text>"{item.nickname}"</Text>}
        </View>
      )}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={loadVehicles}
    />
  );
}
```

#### Criar Novo Veículo

```tsx
import { useVehicles, useCatalog } from '@/lib/api/hooks';

function AddVehicleScreen() {
  const { createVehicle } = useVehicles();
  const { brands, models, versions, loadModels, loadVersions } = useCatalog();

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [year, setYear] = useState('2024');
  const [nickname, setNickname] = useState('');

  const handleSubmit = async () => {
    try {
      await createVehicle({
        brand_id: selectedBrand,
        model_id: selectedModel,
        version_id: selectedVersion,
        year: parseInt(year),
        nickname: nickname || undefined,
      });
      // Navegar de volta
    } catch (error) {
      console.error('Failed to create vehicle:', error);
    }
  };

  return (
    <View>
      <Picker
        selectedValue={selectedBrand}
        onValueChange={(value) => {
          setSelectedBrand(value);
          loadModels(value); // Carregar modelos da marca
        }}
      >
        {brands.map((brand) => (
          <Picker.Item key={brand.id} label={brand.brand} value={brand.id} />
        ))}
      </Picker>

      {/* Selects de modelo e versão... */}

      <Button onPress={handleSubmit}>Create Vehicle</Button>
    </View>
  );
}
```

### 💬 Conversas e Mensagens

#### Listar Conversas

```tsx
import { useConversations } from '@/lib/api/hooks';

function ConversationsScreen() {
  const { conversations, loading, createConversation } = useConversations();

  const handleNewConversation = async (vehicleId: string) => {
    try {
      const conversation = await createConversation({
        vehicle_id: vehicleId,
        title: 'Nova conversa',
      });
      // Navegar para a conversa
      router.push(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  return (
    <FlatList
      data={conversations}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/conversations/${item.id}`)}>
          <Text>{item.title || 'Conversa sem título'}</Text>
          <Text>{item.vehicle?.nickname}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

#### Chat com WebSocket (Tempo Real)

```tsx
import { useChatWebSocket } from '@/lib/api/hooks';
import { useEffect, useRef } from 'react';

function ChatScreen({ conversationId }: { conversationId: string }) {
  const { messages, connected, sendMessage, sendTyping } = useChatWebSocket(conversationId);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText, 'text');
      setInputText('');
    }
  };

  const handleTyping = () => {
    sendTyping(); // Notificar que está digitando
  };

  return (
    <View>
      {/* Indicador de conexão */}
      {!connected && <Text>Connecting...</Text>}

      {/* Lista de mensagens */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View>
            <Text>{item.sender_type}: {item.content}</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.timestamp}-${index}`}
      />

      {/* Input */}
      <TextInput
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
          handleTyping();
        }}
        placeholder="Type a message..."
      />
      <Button onPress={handleSend}>Send</Button>
    </View>
  );
}
```

### ⛽ Abastecimentos

#### Listar Abastecimentos de um Veículo

```tsx
import { useFueling } from '@/lib/api/hooks';

function FuelingHistoryScreen({ vehicleId }: { vehicleId: string }) {
  const { fuelings, stats, loading, error } = useFueling({ vehicleId });

  return (
    <View>
      {/* Estatísticas */}
      {stats && (
        <View>
          <Text>Total gasto: R$ {stats.totalCost.toFixed(2)}</Text>
          <Text>Total litros: {stats.totalLiters.toFixed(2)}L</Text>
          <Text>Média: R$ {stats.averagePricePerLiter.toFixed(2)}/L</Text>
          <Text>Abastecimentos: {stats.count}</Text>
        </View>
      )}

      {/* Lista */}
      <FlatList
        data={fuelings}
        renderItem={({ item }) => (
          <View>
            <Text>{item.date}</Text>
            <Text>{item.liters}L - R$ {item.total_price}</Text>
            <Text>{item.station_name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

#### Registrar Abastecimento

```tsx
import { useFueling } from '@/lib/api/hooks';

function AddFuelingScreen({ vehicleId }: { vehicleId: string }) {
  const { createFueling } = useFueling();

  const handleSubmit = async (data: any) => {
    try {
      await createFueling({
        vehicle_id: vehicleId,
        date: new Date().toISOString().split('T')[0],
        fuel_type: 'gasolina',
        liters: parseFloat(data.liters),
        price_per_liter: parseFloat(data.pricePerLiter),
        total_price: parseFloat(data.liters) * parseFloat(data.pricePerLiter),
        tank_filled: data.tankFilled,
        station_name: data.stationName,
        odometer: data.odometer ? parseInt(data.odometer) : undefined,
      });
      // Navegar de volta
    } catch (error) {
      console.error('Failed to create fueling:', error);
    }
  };

  // Formulário...
}
```

### 🔧 Manutenções

#### Listar Manutenções

```tsx
import { useMaintenance } from '@/lib/api/hooks';

function MaintenanceHistoryScreen({ vehicleId }: { vehicleId: string }) {
  const { maintenances, stats, loading } = useMaintenance({ vehicleId });

  return (
    <View>
      {/* Estatísticas */}
      {stats && (
        <View>
          <Text>Total gasto: R$ {stats.totalCost.toFixed(2)}</Text>
          <Text>Manutenções: {stats.count}</Text>
          {/* Por tipo */}
          {Object.entries(stats.byType).map(([type, count]) => (
            <Text key={type}>{type}: {count}</Text>
          ))}
        </View>
      )}

      {/* Lista */}
      <FlatList
        data={maintenances}
        renderItem={({ item }) => (
          <View>
            <Text>{item.date} - {item.type}</Text>
            <Text>{item.description}</Text>
            <Text>R$ {item.cost}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

### 📤 Upload de Arquivos

#### Upload de Imagem

```tsx
import { uploadService } from '@/lib/api';
import * as ImagePicker from 'expo-image-picker';

async function handleImageUpload() {
  // Selecionar imagem
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return;

  const asset = result.assets[0];

  try {
    // Upload para o backend
    const uploadResult = await uploadService.uploadFile({
      uri: asset.uri,
      name: asset.fileName || 'image.jpg',
      type: asset.type || 'image/jpeg',
    });

    console.log('Upload success:', uploadResult);
    console.log('File URL:', uploadService.getFileUrl(uploadResult.stored_filename));

    // Usar a URL em uma mensagem, por exemplo
    // sendMessage(uploadResult.url, 'image');
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

---

## 🛠️ Uso Direto dos Serviços (Sem Hooks)

Se você preferir não usar hooks, pode chamar os serviços diretamente:

```tsx
import { vehiclesService, authService, fuelingService } from '@/lib/api';

// Autenticação
await authService.login({ email: 'user@example.com', password: 'senha123' });
const user = await authService.getCurrentUser();

// Veículos
const vehicles = await vehiclesService.list();
const vehicle = await vehiclesService.get('vehicle-id');

// Abastecimentos
const fuelings = await fuelingService.list({ vehicleId: 'vehicle-id' });
await fuelingService.create({ /* data */ });
```

---

## ⚙️ Configurações Avançadas

### Interceptar Requisições

Em `lib/api/config.ts`, você pode adicionar mais interceptors:

```typescript
api.interceptors.request.use(
  async (config) => {
    // Adicionar headers customizados
    config.headers['X-Custom-Header'] = 'value';
    return config;
  }
);
```

### Tratar Erros Globalmente

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 500) {
      // Mostrar toast de erro
      Alert.alert('Erro', 'Erro no servidor');
    }
    return Promise.reject(error);
  }
);
```

---

## 🔍 Tipos TypeScript

Todos os tipos estão em `lib/api/types.ts`:

```typescript
import type {
  User,
  Vehicle,
  VehicleWithDetails,
  Conversation,
  Message,
  Fueling,
  Maintenance,
  Brand,
  Model,
  ModelVersion,
} from '@/lib/api/types';
```

---

## 📝 Checklist de Integração

- [ ] Backend FastAPI rodando em `http://localhost:8000`
- [ ] Configurar URL do backend em `lib/api/config.ts`
- [ ] Adicionar `AuthProvider` no `_layout.tsx`
- [ ] Testar login/logout
- [ ] Integrar tela de veículos
- [ ] Integrar tela de conversas
- [ ] Testar WebSocket no chat
- [ ] Testar upload de imagens
- [ ] Integrar abastecimentos
- [ ] Integrar manutenções

---

## 🎯 Próximos Passos

1. **Migrar telas existentes**: Substituir dados mockados por chamadas reais da API
2. **Adicionar tratamento de erros**: Toast/Snackbar para erros de rede
3. **Implementar cache local**: Usar AsyncStorage para cache offline
4. **Adicionar loading states**: Skeletons/spinners em todas as telas
5. **Testes**: Testar todos os fluxos com backend real

---

**Última atualização**: 2025-10-22
