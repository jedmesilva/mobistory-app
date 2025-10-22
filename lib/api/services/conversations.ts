import { api } from '../config';
import type {
  Conversation,
  ConversationWithDetails,
  ConversationCreateRequest,
  Message,
  MessageCreateRequest,
} from '../types';

export const conversationsService = {
  /**
   * Listar conversas do usuário
   */
  async list(vehicleId?: string): Promise<ConversationWithDetails[]> {
    const params = vehicleId ? { vehicle_id: vehicleId } : {};
    const response = await api.get<ConversationWithDetails[]>('/conversations', { params });
    return response.data;
  },

  /**
   * Criar nova conversa
   */
  async create(data: ConversationCreateRequest): Promise<Conversation> {
    const response = await api.post<Conversation>('/conversations', data);
    return response.data;
  },

  /**
   * Obter detalhes de uma conversa
   */
  async get(id: string): Promise<ConversationWithDetails> {
    const response = await api.get<ConversationWithDetails>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Atualizar conversa
   */
  async update(id: string, data: Partial<ConversationCreateRequest>): Promise<Conversation> {
    const response = await api.put<Conversation>(`/conversations/${id}`, data);
    return response.data;
  },

  /**
   * Deletar conversa
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/conversations/${id}`);
  },
};

export const messagesService = {
  /**
   * Listar mensagens de uma conversa
   */
  async list(conversationId: string): Promise<Message[]> {
    const response = await api.get<Message[]>('/messages', {
      params: { conversation_id: conversationId },
    });
    return response.data;
  },

  /**
   * Enviar mensagem
   */
  async create(data: MessageCreateRequest): Promise<Message> {
    const response = await api.post<Message>('/messages', data);
    return response.data;
  },

  /**
   * Obter mensagem
   */
  async get(id: string): Promise<Message> {
    const response = await api.get<Message>(`/messages/${id}`);
    return response.data;
  },

  /**
   * Atualizar mensagem
   */
  async update(id: string, data: Partial<MessageCreateRequest>): Promise<Message> {
    const response = await api.put<Message>(`/messages/${id}`, data);
    return response.data;
  },
};
