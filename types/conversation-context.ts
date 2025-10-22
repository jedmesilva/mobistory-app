/**
 * Types for Conversation Contexts
 * Organização de mensagens por contexto
 */

export type ContextType =
  | 'fueling'           // Abastecimento
  | 'maintenance'       // Manutenção
  | 'odometer'          // Atualização quilometragem
  | 'vehicle_update'    // Atualização dados veículo
  | 'vehicle_register'  // Cadastro de veículo
  | 'document'          // Documentação
  | 'insurance'         // Seguro
  | 'issue'             // Problema/defeito
  | 'general';          // Conversa geral

export type ContextStatus =
  | 'draft'       // IA identificou, aguarda confirmação
  | 'confirmed'   // Usuário confirmou
  | 'completed'   // Contexto finalizado (registro criado)
  | 'cancelled';  // Usuário cancelou

// Metadata específico para cada tipo de contexto
export interface FuelingMetadata {
  liters?: number;
  price?: number;
  pricePerLiter?: number;
  station?: string;
  odometer?: number;
  fuelType?: string;
  tankFilled?: boolean;
}

export interface MaintenanceMetadata {
  type?: string;
  cost?: number;
  parts?: string[];
  provider?: string;
  nextDue?: string;
  description?: string;
}

export interface OdometerMetadata {
  reading?: number;
  photo?: string;
}

export interface VehicleUpdateMetadata {
  field?: string;
  oldValue?: any;
  newValue?: any;
  fields?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

export interface VehicleRegisterMetadata {
  brand?: string;
  model?: string;
  version?: string;
  year?: number;
  plate?: string;
  color?: string;
}

export interface DocumentMetadata {
  documentType?: string;
  expiryDate?: string;
  issueDate?: string;
  documentNumber?: string;
}

export interface InsuranceMetadata {
  provider?: string;
  policyNumber?: string;
  expiryDate?: string;
  coverage?: string;
  cost?: number;
}

export interface IssueMetadata {
  issueType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  resolved?: boolean;
  resolvedAt?: string;
}

// Union type para metadata
export type ContextMetadata =
  | FuelingMetadata
  | MaintenanceMetadata
  | OdometerMetadata
  | VehicleUpdateMetadata
  | VehicleRegisterMetadata
  | DocumentMetadata
  | InsuranceMetadata
  | IssueMetadata
  | Record<string, any>;

// Conversation Context completo
export interface ConversationContext {
  id: string;
  conversation_id: string;
  context_type: ContextType;
  status: ContextStatus;
  title: string | null;
  summary: string | null;
  metadata: ContextMetadata;
  context_hint: string | null;
  ai_confidence: number | null;
  confirmed_by_user: boolean;
  started_at: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  active: boolean;
}

// Tipo para criar um novo contexto
export interface CreateContextParams {
  conversation_id: string;
  context_type: ContextType;
  context_hint?: string;
  title?: string;
  summary?: string;
  metadata?: ContextMetadata;
  ai_confidence?: number;
  started_at?: string;
}

// Tipo para atualizar um contexto
export interface UpdateContextParams {
  status?: ContextStatus;
  title?: string;
  summary?: string;
  metadata?: ContextMetadata;
  confirmed_by_user?: boolean;
  completed_at?: string;
}

// Tipo para mensagem com contexto
export interface MessageWithContext {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  context_id: string | null;
  context_hint: string | null;
  created_at: string;
  updated_at: string;
  context?: ConversationContext | null;
}

// Helper types para agrupamento de mensagens por contexto
export interface ContextGroup {
  context: ConversationContext;
  messages: MessageWithContext[];
  messageCount: number;
}

export interface ConversationWithContexts {
  conversation_id: string;
  contexts: ContextGroup[];
  uncategorizedMessages: MessageWithContext[];
}

// Labels amigáveis para tipos de contexto
export const CONTEXT_TYPE_LABELS: Record<ContextType, string> = {
  fueling: 'Abastecimento',
  maintenance: 'Manutenção',
  odometer: 'Quilometragem',
  vehicle_update: 'Atualização do Veículo',
  vehicle_register: 'Cadastro de Veículo',
  document: 'Documentação',
  insurance: 'Seguro',
  issue: 'Problema',
  general: 'Geral',
};

// Ícones para cada tipo de contexto
export const CONTEXT_TYPE_ICONS: Record<ContextType, string> = {
  fueling: '⛽',
  maintenance: '🔧',
  odometer: '🏁',
  vehicle_update: '📝',
  vehicle_register: '🚗',
  document: '📄',
  insurance: '🛡️',
  issue: '⚠️',
  general: '💬',
};

// Cores para cada tipo de contexto
export const CONTEXT_TYPE_COLORS: Record<ContextType, { bg: string; text: string }> = {
  fueling: { bg: '#dbeafe', text: '#1e40af' },
  maintenance: { bg: '#fef3c7', text: '#92400e' },
  odometer: { bg: '#d1fae5', text: '#065f46' },
  vehicle_update: { bg: '#e0e7ff', text: '#3730a3' },
  vehicle_register: { bg: '#ddd6fe', text: '#5b21b6' },
  document: { bg: '#f3e8ff', text: '#6b21a8' },
  insurance: { bg: '#fce7f3', text: '#9f1239' },
  issue: { bg: '#fee2e2', text: '#991b1b' },
  general: { bg: '#f3f4f6', text: '#374151' },
};
