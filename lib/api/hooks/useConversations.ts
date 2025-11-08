import { useState, useEffect, useCallback } from 'react';
import {
  conversationsService,
  conversationMessagesService,
  conversationParticipantsService,
} from '../services/conversations';
import type {
  Conversation,
  ConversationListResponse,
  ConversationDetailResponse,
  ConversationCreateRequest,
  ConversationUpdateRequest,
  ConversationMessage,
  ConversationMessageCreateRequest,
  ConversationParticipant,
} from '../types';

// =============================================================================
// useConversations - Lista todas as conversas (plural)
// =============================================================================

export const useConversations = (params?: {
  vehicleId?: string;
  entityId?: string;
  status?: string;
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await conversationsService.list({
        vehicle_id: params?.vehicleId,
        entity_id: params?.entityId,
        status: params?.status ?? 'active',
        limit: 100,
      });

      setConversations(result.conversations);
      setTotal(result.total);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load conversations';
      setError(message);
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.vehicleId, params?.entityId, params?.status]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const createConversation = async (entityId: string, data: ConversationCreateRequest) => {
    try {
      const newConversation = await conversationsService.create(entityId, data);
      await loadConversations(); // Recarregar lista
      return newConversation;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create conversation';
      throw new Error(message);
    }
  };

  const archiveConversation = async (conversationId: string, entityId: string) => {
    try {
      await conversationsService.archive(conversationId, entityId);
      await loadConversations(); // Recarregar lista
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to archive conversation';
      throw new Error(message);
    }
  };

  return {
    conversations,
    total,
    loading,
    error,
    reload: loadConversations,
    createConversation,
    archiveConversation,
  };
};

// =============================================================================
// useConversation - Busca ou cria uma conversa específica (singular)
// =============================================================================

export const useConversation = (params: { vehicleId?: string; entityId?: string }) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const findConversation = useCallback(async () => {
    if (!params.vehicleId || !params.entityId) {
      setLoading(false);
      setConversation(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Apenas buscar conversa existente, NÃO criar
      const result = await conversationsService.list({
        vehicle_id: params.vehicleId,
        entity_id: params.entityId,
        status: 'active',
        limit: 1,
      });

      if (result.conversations.length > 0) {
        // Conversa encontrada
        setConversation(result.conversations[0]);
      } else {
        // Nenhuma conversa encontrada - será criada ao enviar primeira mensagem
        setConversation(null);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load conversation';
      setError(message);
      console.error('Error in useConversation:', err);
    } finally {
      setLoading(false);
    }
  }, [params.vehicleId, params.entityId]);

  useEffect(() => {
    findConversation();
  }, [findConversation]);

  const createConversation = async () => {
    if (!params.vehicleId || !params.entityId) {
      throw new Error('Vehicle ID and Entity ID are required');
    }

    try {
      const newConv = await conversationsService.create(params.entityId, {
        primary_vehicle_id: params.vehicleId,
        conversation_type: 'private',
        title: null,
      });
      setConversation(newConv);
      return newConv;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create conversation';
      console.error('Error creating conversation:', err);
      throw new Error(message);
    }
  };

  return {
    conversation,
    loading,
    error,
    reload: findConversation,
    createConversation,
  };
};

// =============================================================================
// useConversationDetail - Busca detalhes completos de uma conversa
// =============================================================================

export const useConversationDetail = (conversationId?: string, entityId?: string) => {
  const [conversationDetail, setConversationDetail] = useState<ConversationDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversationDetail = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      setConversationDetail(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await conversationsService.getById(conversationId, {
        entity_id: entityId,
        include_messages: true,
        messages_limit: 50,
      });

      setConversationDetail(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load conversation details';
      setError(message);
      console.error('Error loading conversation detail:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, entityId]);

  useEffect(() => {
    loadConversationDetail();
  }, [loadConversationDetail]);

  return {
    conversationDetail,
    loading,
    error,
    reload: loadConversationDetail,
  };
};

// =============================================================================
// useMessages - Gerencia mensagens de uma conversa
// =============================================================================

export const useMessages = (conversationId?: string, entityId?: string) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await conversationMessagesService.list(conversationId, {
        entity_id: entityId,
        limit: 100,
      });

      setMessages(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load messages';
      setError(message);
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, entityId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = async (data: ConversationMessageCreateRequest) => {
    if (!conversationId) {
      throw new Error('No conversation ID provided');
    }

    try {
      const newMessage = await conversationMessagesService.send(conversationId, data);
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to send message';
      console.error('Error sending message:', err);
      throw new Error(message);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!conversationId || !entityId) {
      return;
    }

    try {
      await conversationMessagesService.markAsRead(conversationId, messageId, entityId);

      // Não precisa recarregar todas as mensagens, apenas atualiza localmente se necessário
    } catch (err: any) {
      console.error('Error marking message as read:', err);
      // Não lança erro pois é uma operação secundária
    }
  };

  const addMessage = (message: ConversationMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    loading,
    error,
    reload: loadMessages,
    sendMessage,
    markAsRead,
    addMessage,
  };
};

// =============================================================================
// useParticipants - Gerencia participantes de uma conversa
// =============================================================================

export const useParticipants = (conversationId?: string) => {
  const [participants, setParticipants] = useState<ConversationParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParticipants = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      setParticipants([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await conversationParticipantsService.list(conversationId, true);
      setParticipants(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load participants';
      setError(message);
      console.error('Error loading participants:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const addParticipant = async (
    inviterEntityId: string,
    entityId: string,
    role: string = 'viewer'
  ) => {
    if (!conversationId) {
      throw new Error('No conversation ID provided');
    }

    try {
      const newParticipant = await conversationParticipantsService.add(
        conversationId,
        inviterEntityId,
        {
          conversation_id: conversationId,
          entity_id: entityId,
          role,
          participant_type: 'human',
        }
      );

      await loadParticipants(); // Recarregar lista
      return newParticipant;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to add participant';
      throw new Error(message);
    }
  };

  const removeParticipant = async (
    participantId: string,
    removerEntityId: string,
    reason?: string
  ) => {
    if (!conversationId) {
      throw new Error('No conversation ID provided');
    }

    try {
      await conversationParticipantsService.remove(
        conversationId,
        participantId,
        removerEntityId,
        reason
      );

      await loadParticipants(); // Recarregar lista
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to remove participant';
      throw new Error(message);
    }
  };

  return {
    participants,
    loading,
    error,
    reload: loadParticipants,
    addParticipant,
    removeParticipant,
  };
};
