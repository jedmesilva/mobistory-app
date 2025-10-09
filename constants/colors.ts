/**
 * Sistema de cores global do Mobistory
 *
 * Baseado na paleta de cores dark/neutral usada no app.
 * Mantém consistência visual em todos os componentes e telas.
 */

export const Colors = {
  // Cores primárias (tons escuros)
  primary: {
    DEFAULT: '#1f2937',     // gray-800 - Cor principal do app
    dark: '#111827',        // gray-900 - Variação mais escura
    light: '#374151',       // gray-700 - Variação mais clara
  },

  // Cores de texto
  text: {
    primary: '#111827',     // gray-900 - Texto principal
    secondary: '#4b5563',   // gray-600 - Texto secundário
    tertiary: '#6b7280',    // gray-500 - Texto terciário/hints
    placeholder: '#9ca3af', // gray-400 - Placeholders
    inverse: '#ffffff',     // Texto em fundos escuros
  },

  // Cores de fundo
  background: {
    primary: '#ffffff',     // Fundo principal
    secondary: '#f9fafb',   // gray-50 - Fundo secundário
    tertiary: '#f3f4f6',    // gray-100 - Fundo terciário
    card: '#ffffff',        // Fundo de cards
    input: '#f9fafb',       // Fundo de inputs
  },

  // Bordas e divisores
  border: {
    light: '#f3f4f6',       // gray-100 - Bordas muito claras
    DEFAULT: '#e5e7eb',     // gray-200 - Bordas padrão
    dark: '#d1d5db',        // gray-300 - Bordas escuras
  },

  // Cores de status
  success: {
    DEFAULT: '#10b981',     // green-500 - Sucesso
    light: '#d1fae5',       // green-100 - Fundo de sucesso
    dark: '#059669',        // green-600 - Sucesso escuro
    text: '#065f46',        // green-800 - Texto de sucesso
  },

  error: {
    DEFAULT: '#ef4444',     // red-500 - Erro
    light: '#fee2e2',       // red-100 - Fundo de erro
    dark: '#dc2626',        // red-600 - Erro escuro
    text: '#991b1b',        // red-800 - Texto de erro
  },

  warning: {
    DEFAULT: '#f59e0b',     // amber-500 - Aviso
    light: '#fef3c7',       // amber-100 - Fundo de aviso
    dark: '#d97706',        // amber-600 - Aviso escuro
    text: '#92400e',        // amber-800 - Texto de aviso
  },

  info: {
    DEFAULT: '#3b82f6',     // blue-500 - Informação
    light: '#dbeafe',       // blue-100 - Fundo de informação
    dark: '#2563eb',        // blue-600 - Informação escura
    text: '#1e40af',        // blue-800 - Texto de informação
  },

  // Cores de combustível (específicas do domínio)
  fuel: {
    gasoline: '#ef4444',    // Gasolina - Vermelho
    ethanol: '#3b82f6',     // Etanol - Azul
    diesel: '#f59e0b',      // Diesel - Amarelo/Dourado
    flex: '#a855f7',        // Flex - Roxo
    electric: '#06b6d4',    // Elétrico - Ciano
    hybrid: '#10b981',      // Híbrido - Verde
  },

  // Cores de tipo de vínculo com veículo
  relationship: {
    owner: '#10b981',       // Proprietário - Verde
    renter: '#3b82f6',      // Locatário - Azul
    authorized: '#f59e0b',  // Condutor autorizado - Amarelo
    former: '#6b7280',      // Ex-proprietário - Cinza
  },

  // Transparências úteis
  opacity: {
    overlay: 'rgba(0, 0, 0, 0.5)',      // Overlay escuro
    overlayLight: 'rgba(0, 0, 0, 0.3)', // Overlay claro
    disabled: 'rgba(0, 0, 0, 0.4)',     // Elementos desabilitados
  },
} as const;

// Tipo para autocomplete do TypeScript
export type ColorPalette = typeof Colors;
