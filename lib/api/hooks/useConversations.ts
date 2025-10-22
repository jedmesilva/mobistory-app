import { useState, useEffect, useCallback } from 'react';
import { conversationsService, messagesService } from '../services';
import type {
  ConversationWithDetails,
  ConversationCreateRequest,
  Message,
  MessageCreateRequest,
} from '../types';

export const useConversations = (vehicleId?: string) => {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await conversationsService.list(vehicleId);
      setConversations(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load conversations';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const createConversation = async (data: ConversationCreateRequest) => {
    try {
      const newConversation = await conversationsService.create(data);
      await loadConversations(); // Recarregar lista
      return newConversation;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create conversation';
      throw new Error(message);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await conversationsService.delete(id);
      await loadConversations(); // Recarregar lista
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete conversation';
      throw new Error(message);
    }
  };

  return {
    conversations,
    loading,
    error,
    loadConversations,
    createConversation,
    deleteConversation,
  };
};

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await messagesService.list(conversationId);
      setMessages(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load messages';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = async (data: MessageCreateRequest) => {
    try {
      const newMessage = await messagesService.create(data);
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to send message';
      throw new Error(message);
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    addMessage,
  };
};
