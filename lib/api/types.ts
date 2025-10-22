// ===============================
// Auth Types
// ===============================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// ===============================
// Vehicle Types
// ===============================

export interface Brand {
  id: string;
  brand: string;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: string;
  brand_id: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface ModelVersion {
  id: string;
  model_id: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  brand_id: string;
  model_id: string;
  version_id: string | null;
  year: number;
  nickname: string | null;
  color_id: string | null;
  plate_id: string | null;
  current_odometer: number | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleWithDetails extends Vehicle {
  brand?: Brand;
  model?: Model;
  version?: ModelVersion;
}

export interface VehicleCreateRequest {
  brand_id: string;
  model_id: string;
  version_id?: string;
  year: number;
  nickname?: string;
  current_odometer?: number;
}

// ===============================
// Conversation Types
// ===============================

export type ContextType =
  | 'fueling'
  | 'maintenance'
  | 'odometer'
  | 'vehicle_update'
  | 'vehicle_register'
  | 'document'
  | 'insurance'
  | 'issue'
  | 'general';

export type ContextStatus = 'draft' | 'completed' | 'cancelled';

export interface ConversationContext {
  id: string;
  conversation_id: string;
  context_type: ContextType;
  status: ContextStatus;
  title: string | null;
  summary: string | null;
  metadata: Record<string, any>;
  context_hint: string | null;
  ai_confidence: number | null;
  confirmed_by_user: boolean;
  started_at: string;
  completed_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationWithDetails extends Conversation {
  vehicle?: Vehicle;
  contexts?: ConversationContext[];
  message_count?: number;
  last_message?: Message;
}

export interface ConversationCreateRequest {
  vehicle_id?: string;
  title?: string;
}

// ===============================
// Message Types
// ===============================

export type MessageType = 'text' | 'voice' | 'image';
export type SenderType = 'user' | 'assistant';

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  message_type: MessageType;
  content: string;
  media_url: string | null;
  context_hint: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageCreateRequest {
  conversation_id: string;
  message_type: MessageType;
  content: string;
  media_url?: string;
  context_hint?: string;
}

// ===============================
// Fueling Types
// ===============================

export interface Fueling {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number | null;
  fuel_type: string;
  liters: number | null;
  price_per_liter: number | null;
  total_price: number | null;
  tank_filled: boolean;
  station_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FuelingCreateRequest {
  vehicle_id: string;
  date: string;
  odometer?: number;
  fuel_type: string;
  liters?: number;
  price_per_liter?: number;
  total_price?: number;
  tank_filled?: boolean;
  station_name?: string;
  notes?: string;
}

// ===============================
// Maintenance Types
// ===============================

export interface Maintenance {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number | null;
  type: string;
  description: string | null;
  cost: number | null;
  provider: string | null;
  parts: string | null;
  next_due_date: string | null;
  next_due_odometer: number | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceCreateRequest {
  vehicle_id: string;
  date: string;
  odometer?: number;
  type: string;
  description?: string;
  cost?: number;
  provider?: string;
  parts?: string;
  next_due_date?: string;
  next_due_odometer?: number;
}

// ===============================
// Upload Types
// ===============================

export interface UploadResponse {
  filename: string;
  stored_filename: string;
  url: string;
  file_type: 'image' | 'audio' | 'video' | 'other';
  size: number;
}

// ===============================
// WebSocket Types
// ===============================

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'system' | 'error';
  content?: string;
  message_id?: string;
  sender_type?: SenderType;
  message_type?: MessageType;
  timestamp: string;
  user_id?: string;
}

// ===============================
// API Response Types
// ===============================

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}
