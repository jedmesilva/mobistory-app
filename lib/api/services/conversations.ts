import { api } from '../config';
import type {
  ConversationContextSchema,
  Conversation,
  ConversationWithDetails,
  ConversationListResponse,
  ConversationDetailResponse,
  ConversationCreateRequest,
  ConversationUpdateRequest,
  ConversationMessage,
  ConversationMessageCreateRequest,
  ConversationMessageUpdateRequest,
  ConversationParticipant,
  ConversationParticipantCreateRequest,
  ConversationParticipantUpdateRequest,
} from '../types';

// =============================================================================
// CONVERSATION CONTEXTS SERVICE
// =============================================================================

export const conversationContextsService = {
  /**
   * Lista todos os contextos de conversas disponíveis
   */
  async list(params?: {
    skip?: number;
    limit?: number;
    active_only?: boolean;
  }): Promise<ConversationContextSchema[]> {
    const response = await api.get<ConversationContextSchema[]>('/conversations/contexts', {
      params: {
        skip: params?.skip ?? 0,
        limit: params?.limit ?? 100,
        active_only: params?.active_only ?? true,
      },
    });
    return response.data;
  },

  /**
   * Cria um novo contexto de conversa
   */
  async create(data: {
    code: string;
    category?: string;
    name: string;
    description?: string;
    keywords?: Record<string, any>;
    available_actions?: Record<string, any>;
    ai_instructions?: string;
    requires_link?: boolean;
    required_permissions?: Record<string, any>;
    active?: boolean;
  }): Promise<ConversationContextSchema> {
    const response = await api.post<ConversationContextSchema>('/conversations/contexts', data);
    return response.data;
  },

  /**
   * Obtém detalhes de um contexto específico
   */
  async getById(contextId: string): Promise<ConversationContextSchema> {
    const response = await api.get<ConversationContextSchema>(`/conversations/contexts/${contextId}`);
    return response.data;
  },

  /**
   * Atualiza um contexto de conversa
   */
  async update(
    contextId: string,
    data: Partial<{
      code: string;
      category: string;
      name: string;
      description: string;
      keywords: Record<string, any>;
      available_actions: Record<string, any>;
      ai_instructions: string;
      requires_link: boolean;
      required_permissions: Record<string, any>;
      active: boolean;
    }>
  ): Promise<ConversationContextSchema> {
    const response = await api.patch<ConversationContextSchema>(
      `/conversations/contexts/${contextId}`,
      data
    );
    return response.data;
  },

  /**
   * Desativa um contexto de conversa (soft delete)
   */
  async delete(contextId: string): Promise<void> {
    await api.delete(`/conversations/contexts/${contextId}`);
  },
};

// =============================================================================
// CONVERSATIONS SERVICE
// =============================================================================

export const conversationsService = {
  /**
   * Lista conversas com filtros opcionais
   */
  async list(params?: {
    skip?: number;
    limit?: number;
    vehicle_id?: string;
    entity_id?: string;
    status?: string;
    conversation_type?: string;
  }): Promise<ConversationListResponse> {
    const queryParams: any = {
      skip: params?.skip ?? 0,
      limit: params?.limit ?? 20,
    };

    if (params?.vehicle_id) queryParams.vehicle_id = params.vehicle_id;
    if (params?.entity_id) queryParams.entity_id = params.entity_id;
    if (params?.status) queryParams.status = params.status;
    if (params?.conversation_type) queryParams.conversation_type = params.conversation_type;

    const response = await api.get<ConversationListResponse>('/conversations', {
      params: queryParams,
    });
    return response.data;
  },

  /**
   * Cria uma nova conversa
   * IMPORTANTE: O entity_id é obrigatório e será automaticamente adicionado como primeiro participante com role='owner'
   */
  async create(entityId: string, data: ConversationCreateRequest): Promise<Conversation> {
    const response = await api.post<Conversation>(`/conversations?entity_id=${entityId}`, data);
    return response.data;
  },

  /**
   * Obtém detalhes completos de uma conversa
   * Inclui: participantes, contexto, mensagens recentes e permissões
   */
  async getById(
    conversationId: string,
    params?: {
      entity_id?: string;
      include_messages?: boolean;
      messages_limit?: number;
    }
  ): Promise<ConversationDetailResponse> {
    const queryParams: any = {
      include_messages: params?.include_messages ?? true,
      messages_limit: params?.messages_limit ?? 50,
    };

    if (params?.entity_id) queryParams.entity_id = params.entity_id;

    const response = await api.get<ConversationDetailResponse>(
      `/conversations/${conversationId}`,
      { params: queryParams }
    );
    return response.data;
  },

  /**
   * Atualiza uma conversa (apenas owner pode atualizar)
   */
  async update(
    conversationId: string,
    entityId: string,
    data: ConversationUpdateRequest
  ): Promise<Conversation> {
    const response = await api.patch<Conversation>(
      `/conversations/${conversationId}?entity_id=${entityId}`,
      data
    );
    return response.data;
  },

  /**
   * Arquiva uma conversa (soft delete)
   * Apenas o owner pode arquivar
   */
  async archive(conversationId: string, entityId: string): Promise<void> {
    await api.delete(`/conversations/${conversationId}?entity_id=${entityId}`);
  },
};

// =============================================================================
// CONVERSATION PARTICIPANTS SERVICE
// =============================================================================

export const conversationParticipantsService = {
  /**
   * Lista todos os participantes de uma conversa
   */
  async list(
    conversationId: string,
    activeOnly: boolean = true
  ): Promise<ConversationParticipant[]> {
    const response = await api.get<ConversationParticipant[]>(
      `/conversations/${conversationId}/participants`,
      {
        params: { active_only: activeOnly },
      }
    );
    return response.data;
  },

  /**
   * Adiciona um novo participante à conversa
   * Requer que o inviter_entity_id seja owner ou admin
   */
  async add(
    conversationId: string,
    inviterEntityId: string,
    data: ConversationParticipantCreateRequest
  ): Promise<ConversationParticipant> {
    const response = await api.post<ConversationParticipant>(
      `/conversations/${conversationId}/participants?inviter_entity_id=${inviterEntityId}`,
      data
    );
    return response.data;
  },

  /**
   * Atualiza um participante (role, permissões, etc)
   * Apenas owner pode atualizar
   */
  async update(
    conversationId: string,
    participantId: string,
    updaterEntityId: string,
    data: ConversationParticipantUpdateRequest
  ): Promise<ConversationParticipant> {
    const response = await api.patch<ConversationParticipant>(
      `/conversations/${conversationId}/participants/${participantId}?updater_entity_id=${updaterEntityId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove um participante da conversa
   * Owner e admin podem remover (exceto o próprio owner)
   */
  async remove(
    conversationId: string,
    participantId: string,
    removerEntityId: string,
    reason?: string
  ): Promise<void> {
    const params: any = { remover_entity_id: removerEntityId };
    if (reason) params.reason = reason;

    await api.delete(
      `/conversations/${conversationId}/participants/${participantId}`,
      { params }
    );
  },
};

// =============================================================================
// CONVERSATION MESSAGES SERVICE
// =============================================================================

export const conversationMessagesService = {
  /**
   * Lista mensagens de uma conversa
   */
  async list(
    conversationId: string,
    params?: {
      skip?: number;
      limit?: number;
      entity_id?: string;
    }
  ): Promise<ConversationMessage[]> {
    const queryParams: any = {
      skip: params?.skip ?? 0,
      limit: params?.limit ?? 50,
    };

    if (params?.entity_id) queryParams.entity_id = params.entity_id;

    const response = await api.get<ConversationMessage[]>(
      `/conversations/${conversationId}/messages`,
      { params: queryParams }
    );
    return response.data;
  },

  /**
   * Envia uma nova mensagem na conversa
   * O sender deve ser um participante ativo
   */
  async send(
    conversationId: string,
    data: ConversationMessageCreateRequest
  ): Promise<ConversationMessage> {
    const response = await api.post<ConversationMessage>(
      `/conversations/${conversationId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * Atualiza uma mensagem
   * Apenas o sender ou admin/owner podem atualizar
   */
  async update(
    conversationId: string,
    messageId: string,
    entityId: string,
    data: ConversationMessageUpdateRequest
  ): Promise<ConversationMessage> {
    const response = await api.patch<ConversationMessage>(
      `/conversations/${conversationId}/messages/${messageId}?entity_id=${entityId}`,
      data
    );
    return response.data;
  },

  /**
   * Marca uma mensagem como lida pelo participante
   * Atualiza automaticamente unread_count
   */
  async markAsRead(
    conversationId: string,
    messageId: string,
    entityId: string
  ): Promise<void> {
    await api.post(
      `/conversations/${conversationId}/messages/${messageId}/mark-as-read?entity_id=${entityId}`
    );
  },
};

// =============================================================================
// LEGACY EXPORT (for backwards compatibility)
// =============================================================================

export { conversationsService as default };
