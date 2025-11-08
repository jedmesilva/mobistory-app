# Mobistory App

Aplicativo móvel do Mobistory desenvolvido em React Native com Expo.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Para Android: Android Studio e SDK instalados
- Para iOS: Xcode (apenas macOS)

## Backend Local

Este aplicativo se conecta a um backend FastAPI local. O backend deve estar rodando antes de usar o app.

### Iniciando o Backend

1. Navegue até a pasta do backend:
```bash
cd C:\Users\Dell\Desktop\mobistory-backend
```

2. Certifique-se de que o PostgreSQL está rodando:
```bash
docker compose up -d
```

3. Inicie o servidor FastAPI:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

O backend estará disponível em:
- API: http://172.31.3.209:8000
- Documentação: http://172.31.3.209:8000/docs

## Instalação

1. Clone o repositório:
```bash
cd C:\Users\Dell\Desktop\mobistory-app
```

2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

### Rodando no Expo Go (mais simples)

```bash
npm start
```

Escaneie o QR code com o aplicativo Expo Go no seu celular.

### Rodando em modo de desenvolvimento nativo

#### Android (via USB)

1. Conecte seu dispositivo Android via USB
2. Habilite a depuração USB nas configurações do desenvolvedor
3. Execute:
```bash
npm run android
```

#### iOS (apenas macOS)

```bash
npm run ios
```

## Configuração

### IP do Backend

O app está configurado para se conectar ao backend local através do IP `172.31.3.209`.

Se o IP da sua máquina for diferente:

1. Descubra o IP da sua máquina:
```bash
ipconfig
```

2. Atualize o arquivo `lib/api/config.ts`:
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://SEU_IP_AQUI:8000/api/v1'
  : 'https://api.mobistory.com/api/v1';
```

## Estrutura do Projeto

```
mobistory-app/
├── app/                    # Telas do aplicativo (Expo Router)
├── components/            # Componentes reutilizáveis
│   ├── icons/            # Ícones SVG customizados
│   ├── ui/               # Componentes UI base
│   └── vehicle/          # Componentes específicos de veículos
├── contexts/             # Contextos React (Auth, etc)
├── hooks/                # Hooks customizados
│   ├── vehicle/         # Hooks de veículos
│   └── moment/          # Hooks de momentos
├── lib/                  # Bibliotecas e utilitários
│   └── api/             # Cliente API e serviços
├── types/                # Definições TypeScript
└── constants/           # Constantes (cores, etc)
```

## API

O aplicativo se comunica com o backend através de serviços localizados em `lib/api/`:

- `auth.ts` - Autenticação e gerenciamento de usuários
- `vehicles.ts` - Operações com veículos
- `conversations.ts` - Conversas e mensagens
- `moments.ts` - Momentos do veículo (abastecimento, manutenção, etc)
- `entities.ts` - Entidades (usuários/proprietários)

## Autenticação

O app usa JWT (JSON Web Tokens) para autenticação. O token é armazenado localmente usando AsyncStorage e automaticamente incluído em todas as requisições.

Para fazer login:
```typescript
import { useAuth } from '@/contexts/auth/AuthContext';

const { login } = useAuth();
await login('email@example.com', 'senha');
```

## Build para Produção

### Android

```bash
npm run android -- --variant release
```

### iOS

```bash
npm run ios -- --configuration Release
```

## Troubleshooting

### Não consigo conectar ao backend

1. Verifique se o backend está rodando:
```bash
curl http://172.31.3.209:8000/health
```

2. Verifique se o celular está na mesma rede WiFi que o computador

3. Verifique se o firewall não está bloqueando a porta 8000

### Erro ao buildar o app

1. Limpe o cache do Expo:
```bash
npx expo start -c
```

2. Reinstale as dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Tecnologias Utilizadas

- React Native 0.81.4
- Expo SDK 54
- TypeScript
- Axios (cliente HTTP)
- React Navigation
- Expo Router
- AsyncStorage

## Licença

Propriedade da Mobistory. Todos os direitos reservados.
