# Sistema de Cores do Mobistory

Este documento descreve o sistema de cores global do aplicativo e como utilizá-lo.

## Estrutura

O sistema de cores está organizado em categorias semânticas para facilitar o uso e manutenção:

### 1. Cores Primárias
```typescript
Colors.primary.DEFAULT  // #1f2937 - Cor principal (botões, destaques)
Colors.primary.dark     // #111827 - Variação escura
Colors.primary.light    // #374151 - Variação clara
```

### 2. Cores de Texto
```typescript
Colors.text.primary      // #111827 - Títulos e texto principal
Colors.text.secondary    // #4b5563 - Subtítulos
Colors.text.tertiary     // #6b7280 - Texto auxiliar
Colors.text.placeholder  // #9ca3af - Placeholders de inputs
Colors.text.inverse      // #ffffff - Texto em fundos escuros
```

### 3. Cores de Fundo
```typescript
Colors.background.primary    // #ffffff - Fundo principal
Colors.background.secondary  // #f9fafb - Fundo secundário (seções)
Colors.background.tertiary   // #f3f4f6 - Fundo terciário (badges)
Colors.background.card       // #ffffff - Fundo de cards
Colors.background.input      // #f9fafb - Fundo de inputs
```

### 4. Bordas e Divisores
```typescript
Colors.border.light    // #f3f4f6 - Bordas muito claras
Colors.border.DEFAULT  // #e5e7eb - Bordas padrão
Colors.border.dark     // #d1d5db - Bordas escuras
```

### 5. Cores de Status
```typescript
// Sucesso (verde)
Colors.success.DEFAULT
Colors.success.light
Colors.success.dark
Colors.success.text

// Erro (vermelho)
Colors.error.DEFAULT
Colors.error.light
Colors.error.dark
Colors.error.text

// Aviso (amarelo)
Colors.warning.DEFAULT
Colors.warning.light
Colors.warning.dark
Colors.warning.text

// Informação (azul)
Colors.info.DEFAULT
Colors.info.light
Colors.info.dark
Colors.info.text
```

### 6. Cores Específicas do Domínio

#### Tipos de Combustível
```typescript
Colors.fuel.gasoline  // #ef4444 - Vermelho
Colors.fuel.ethanol   // #3b82f6 - Azul
Colors.fuel.diesel    // #f59e0b - Amarelo
Colors.fuel.flex      // #a855f7 - Roxo
Colors.fuel.electric  // #06b6d4 - Ciano
Colors.fuel.hybrid    // #10b981 - Verde
```

#### Tipos de Vínculo
```typescript
Colors.relationship.owner       // #10b981 - Proprietário (verde)
Colors.relationship.renter      // #3b82f6 - Locatário (azul)
Colors.relationship.authorized  // #f59e0b - Autorizado (amarelo)
Colors.relationship.former      // #6b7280 - Ex-proprietário (cinza)
```

### 7. Transparências
```typescript
Colors.opacity.overlay       // rgba(0, 0, 0, 0.5) - Overlay escuro
Colors.opacity.overlayLight  // rgba(0, 0, 0, 0.3) - Overlay claro
Colors.opacity.disabled      // rgba(0, 0, 0, 0.4) - Elementos desabilitados
```

## Como Usar

### Importação
```typescript
import { Colors } from '@/constants/colors';
// ou
import { Colors } from '@/constants';
```

### Uso em StyleSheet
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderColor: Colors.border.DEFAULT,
  },
  title: {
    color: Colors.text.primary,
  },
  subtitle: {
    color: Colors.text.secondary,
  },
  button: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  successBadge: {
    backgroundColor: Colors.success.light,
    color: Colors.success.text,
  },
});
```

### Uso em Componentes
```typescript
<View style={{ backgroundColor: Colors.background.secondary }}>
  <Text style={{ color: Colors.text.primary }}>Título</Text>
  <Text style={{ color: Colors.text.tertiary }}>Descrição</Text>
</View>
```

## Migração de Cores Hardcoded

### Antes (Hardcoded)
```typescript
const styles = StyleSheet.create({
  title: {
    color: '#111827',
  },
  button: {
    backgroundColor: '#1f2937',
  },
  border: {
    borderColor: '#e5e7eb',
  },
});
```

### Depois (Sistema de Cores)
```typescript
import { Colors } from '@/constants';

const styles = StyleSheet.create({
  title: {
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  border: {
    borderColor: Colors.border.DEFAULT,
  },
});
```

## Tabela de Conversão Rápida

| Cor Hardcoded | Uso no Sistema de Cores |
|--------------|------------------------|
| `#1f2937` | `Colors.primary.DEFAULT` |
| `#111827` | `Colors.primary.dark` ou `Colors.text.primary` |
| `#4b5563` | `Colors.text.secondary` |
| `#6b7280` | `Colors.text.tertiary` |
| `#9ca3af` | `Colors.text.placeholder` |
| `#ffffff` | `Colors.background.primary` ou `Colors.text.inverse` |
| `#f9fafb` | `Colors.background.secondary` ou `Colors.background.input` |
| `#f3f4f6` | `Colors.background.tertiary` |
| `#e5e7eb` | `Colors.border.DEFAULT` |
| `#10b981` | `Colors.success.DEFAULT` |
| `#ef4444` | `Colors.error.DEFAULT` |
| `#f59e0b` | `Colors.warning.DEFAULT` |
| `#3b82f6` | `Colors.info.DEFAULT` |

## Benefícios

1. **Consistência**: Todas as telas usam as mesmas cores
2. **Manutenibilidade**: Alterar uma cor em um único lugar atualiza todo o app
3. **Semântica**: Nomes descritivos facilitam o entendimento
4. **Acessibilidade**: Cores organizadas por contexto de uso
5. **Theme Ready**: Preparado para suporte a dark mode no futuro
6. **TypeScript**: Autocomplete e type safety

## Próximos Passos

1. Migrar componentes existentes para usar o sistema de cores
2. Garantir que novos componentes sempre usem o sistema
3. Implementar suporte a dark mode (opcional)
4. Adicionar variantes de cores conforme necessário
