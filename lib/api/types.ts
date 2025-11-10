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
// Vehicle Types (Updated for FastAPI Backend)
// ===============================

export interface Brand {
  id: string;
  name: string;  // Changed from "brand" to "name"
  country_of_origin?: string;
  logo_url?: string;
  active?: boolean;
  verified?: boolean;
  created_at?: string;
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;  // Changed from "model" to "name"
  category?: string;
  active?: boolean;
  verified?: boolean;
  created_at?: string;
}

export interface ModelVersion {
  id: string;
  model_id: string;
  name: string;  // Changed from "version" to "name"
  start_year?: number;
  end_year?: number;
  fuel_type?: string;
  transmission?: string;
  active?: boolean;
  verified?: boolean;
  created_at?: string;
}

export interface EntityLink {
  id: string;
  link_code: string;
  entity_id: string;
  vehicle_id: string;
  link_type_id?: string;
  status: string;  // pending, active, terminated, etc
  start_date: string;
  end_date?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  // Dados da entidade vinculada
  entity?: {
    id: string;
    display_name: string;
    email?: string;
    phone?: string;
    entity_code: string;
  };
}

export interface Vehicle {
  id: string;
  brand_id: string;
  model_id: string;
  version_id: string | null;
  vin: string | null;  // Changed from "chassis" to "vin"
  renavam: string | null;
  manufacturing_year: number | null;
  model_year: number | null;
  current_plate: string | null;  // Changed from plate_id to current_plate (string)
  current_color: string | null;  // Changed from color_id to current_color (string)
  current_km: number | null;  // Changed from current_odometer
  visibility: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleWithDetails extends Vehicle {
  // Relacionamentos com novos nomes
  brand: Brand | null;     // Changed from "brands" (plural) to "brand" (singular)
  model: Model | null;     // Changed from "models" (plural) to "model" (singular)
  version: ModelVersion | null;  // Changed from "model_versions" to "version"

  // Links com entidades (obtidos via endpoint separado)
  entity_links?: EntityLink[];
}

// Interface de compatibilidade com código antigo (conversão)
export interface VehicleCover {
  id: string;
  vehicle_id: string;
  file_id: string;
  is_primary: boolean;
  display_order: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleWithDetailsLegacy {
  id: string;
  brand_id: string;
  model_id: string;
  version_id: string | null;
  chassis: string;
  model_year: number;
  manufacture_year: number;

  // Nomes antigos do Supabase
  brands: { brand: string };
  models: { model: string };
  model_versions: { version: string } | null;
  plates: Array<{ plate: string; active: boolean }>;
  colors: Array<{ color: string; active: boolean }>;
  vehicle_entity_links?: EntityLink[];
  covers?: VehicleCover[];
  primary_cover_url?: string | null;
}

export interface PlateModel {
  id: string;
  code: string;
  name: string;
  country: string;
  description?: string;
  format_pattern?: string;
  format_regex?: string;
  format_example?: string;
  valid_from?: string;
  valid_until?: string;
  has_qrcode: boolean;
  has_chip: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlateType {
  id: string;
  plate_model_id: string;
  code: string;
  name: string;
  description?: string;
  color_code: string;
  background_color?: string;
  text_color?: string;
  border_color?: string;
  vehicle_category?: string;
  requires_special_license: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlateDetectionResult {
  detected: boolean;
  model?: {
    id: string;
    code: string;
    name: string;
    format_pattern?: string;
    format_example?: string;
    has_qrcode: boolean;
    has_chip: boolean;
  };
  available_types?: PlateType[];
  message?: string;
  available_models?: Array<{
    id: string;
    code: string;
    name: string;
    format_pattern?: string;
    format_example?: string;
  }>;
}

export interface Color {
  id: string;
  name: string;
  description?: string;
  hex_code?: string;
  rgb_r?: number;
  rgb_g?: number;
  rgb_b?: number;
  cmyk_c?: number;
  cmyk_m?: number;
  cmyk_y?: number;
  cmyk_k?: number;
  finish_type?: string;  // solid, metallic, pearlescent, matte, glossy
  verified: boolean;
  active: boolean;
  created_by?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface ColorCreateRequest {
  name: string;
  description?: string;
  hex_code?: string;
  rgb_r?: number;
  rgb_g?: number;
  rgb_b?: number;
  cmyk_c?: number;
  cmyk_m?: number;
  cmyk_y?: number;
  cmyk_k?: number;
  finish_type?: string;
}

export interface VehicleColor {
  id: string;
  vehicle_id: string;
  color_id: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreateRequest {
  brand_id: string;
  model_id: string;
  version_id?: string;
  vin?: string;
  renavam?: string;
  manufacturing_year?: number;
  model_year?: number;
  current_plate?: string;
  current_color?: string;
  current_km?: number;
  visibility?: string;
  observations?: string;

  // Campos para criação de placa (opcional)
  plate_number?: string;
  plate_type_id?: string;
  licensing_date?: string;
  licensing_country?: string;
  plate_state?: string;
  plate_city?: string;

  // Campo para criar relacionamento cor-veículo (opcional)
  color_id?: string;

  // Campo para criar link com entidade (opcional)
  entity_id?: string;
  link_type_id?: string;
}

// ===============================
// Conversation Types (Updated to match FastAPI Backend)
// ===============================

// Context de conversa (tabela: conversation_contexts)
export interface ConversationContextSchema {
  id: string;
  code: string;
  category: string | null;
  name: string;
  description: string | null;
  keywords: Record<string, any> | null;
  available_actions: Record<string, any> | null;
  ai_instructions: string | null;
  requires_link: boolean | null;
  required_permissions: Record<string, any> | null;
  active: boolean;
  created_at: string;
}

// Conversa principal (tabela: conversations)
export interface Conversation {
  id: string;
  conversation_code: string;
  primary_vehicle_id: string | null;
  vehicle_ids: string | null;
  conversation_type: string | null;  // private, group, support
  title: string | null;
  summary: string | null;
  status: string;  // active, archived, closed
  main_context_id: string | null;
  total_participants: number;
  active_participants: number;
  total_messages: number;
  total_actions_executed: number;
  started_at: string | null;
  last_message_at: string | null;
  finished_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

// Participante de conversa (tabela: conversation_participants)
export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  entity_id: string;
  link_id: string | null;
  role: string;  // owner, admin, driver, viewer
  participant_type: string;  // human, ai, system
  joined_at: string | null;
  left_at: string | null;
  is_active: boolean;
  invited_by_entity_id: string | null;
  invited_by_participant_id: string | null;
  invitation_reason: string | null;
  removed_by_entity_id: string | null;
  removal_reason: string | null;
  permissions: Record<string, any> | null;
  context_summary_at_join: string | null;
  auto_leave_config: Record<string, any> | null;
  notification_enabled: boolean;
  last_read_message_id: string | null;
  last_read_at: string | null;
  unread_count: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// Mensagem de conversa (tabela: conversation_messages)
export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_entity_id: string;
  sender_participant_id: string | null;
  directed_to_entity_id: string | null;
  directed_to_participant_id: string | null;
  content: string;
  message_type: string;  // text, image, video, audio, system, action
  context_id: string | null;
  context_confidence: number | null;
  detected_intent: string | null;
  extracted_entities: Record<string, any> | null;
  action_id: string | null;
  action_executed: boolean;
  action_result: Record<string, any> | null;
  requires_confirmation: boolean;
  confirmed: boolean;
  confirmed_at: string | null;
  confirmed_by_entity_id: string | null;
  attachments_urls: string | null;
  visible_to_participant_ids: string | null;
  is_private: boolean;
  requires_user_interaction: boolean;
  interaction_reason: string | null;
  auto_processed: boolean;
  processed: boolean;
  processed_at: string | null;
  reactions: Record<string, any> | null;
  created_at: string;
}

// Participante com informações da entidade
export interface ConversationParticipantWithEntity extends ConversationParticipant {
  entity?: {
    id: string;
    display_name: string;
    email: string | null;
    phone: string | null;
    entity_code: string;
  } | null;
}

// Mensagem com informações de sender e contexto
export interface ConversationMessageWithDetails extends ConversationMessage {
  sender_entity?: {
    id: string;
    display_name: string;
    email: string | null;
    phone: string | null;
    entity_code: string;
  } | null;
  context?: ConversationContextSchema | null;
}

// Conversa com detalhes completos
export interface ConversationWithDetails extends Conversation {
  primary_vehicle?: Vehicle | null;
  main_context?: ConversationContextSchema | null;
  participants: ConversationParticipantWithEntity[];
  messages: ConversationMessageWithDetails[];
}

// Response de listagem de conversas
export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  page_size: number;
}

// Response detalhado de conversa com permissões
export interface ConversationDetailResponse {
  conversation: ConversationWithDetails;
  can_send_message: boolean;
  can_invite_participants: boolean;
  can_manage_conversation: boolean;
}

// Request para criar conversa
export interface ConversationCreateRequest {
  primary_vehicle_id?: string;
  vehicle_ids?: string;
  conversation_type?: string;
  title?: string;
  main_context_id?: string;
}

// Request para atualizar conversa
export interface ConversationUpdateRequest {
  primary_vehicle_id?: string;
  vehicle_ids?: string;
  conversation_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  main_context_id?: string;
}

// Request para criar mensagem
export interface ConversationMessageCreateRequest {
  conversation_id: string;
  sender_entity_id: string;
  sender_participant_id?: string;
  directed_to_entity_id?: string;
  directed_to_participant_id?: string;
  content: string;
  message_type?: string;
  context_id?: string;
  attachments_urls?: string;
  is_private?: boolean;
  requires_confirmation?: boolean;
}

// Request para atualizar mensagem
export interface ConversationMessageUpdateRequest {
  content?: string;
  confirmed?: boolean;
  confirmed_by_entity_id?: string;
  processed?: boolean;
  reactions?: Record<string, any>;
}

// Request para criar participante
export interface ConversationParticipantCreateRequest {
  conversation_id: string;
  entity_id: string;
  link_id?: string;
  role?: string;
  participant_type?: string;
  invited_by_entity_id?: string;
  invitation_reason?: string;
  permissions?: Record<string, any>;
  notification_enabled?: boolean;
}

// Request para atualizar participante
export interface ConversationParticipantUpdateRequest {
  role?: string;
  permissions?: Record<string, any>;
  notification_enabled?: boolean;
  is_active?: boolean;
}

// ===============================
// Legacy Types (Backwards Compatibility)
// ===============================

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'voice';
export type SenderType = 'user' | 'assistant';

// Legacy Message type (for backwards compatibility)
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

// Legacy MessageCreateRequest (for backwards compatibility)
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
