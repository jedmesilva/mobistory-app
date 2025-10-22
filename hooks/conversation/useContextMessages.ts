import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type {
  MessageWithContext,
  ContextGroup,
  ConversationWithContexts,
} from '@/types/conversation-context';

export function useContextMessages(conversationId: string | undefined) {
  const [data, setData] = useState<ConversationWithContexts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchContextMessages(conversationId);
    } else {
      setData(null);
      setLoading(false);
    }
  }, [conversationId]);

  async function fetchContextMessages(conversationId: string) {
    try {
      setLoading(true);
      setError(null);

      // Buscar todos os contextos da conversa
      const { data: contexts, error: contextsError } = await supabase
        .from('conversation_contexts')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('active', true)
        .order('started_at', { ascending: false });

      if (contextsError) throw contextsError;

      // Buscar todas as mensagens da conversa
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Agrupar mensagens por contexto
      const contextGroups: ContextGroup[] = (contexts || []).map(context => ({
        context,
        messages: (messages || []).filter(msg => msg.context_id === context.id),
        messageCount: (messages || []).filter(msg => msg.context_id === context.id).length,
      }));

      // Mensagens sem contexto
      const uncategorizedMessages = (messages || []).filter(msg => !msg.context_id);

      setData({
        conversation_id: conversationId,
        contexts: contextGroups,
        uncategorizedMessages,
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching context messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateMessageContext(
    messageId: string,
    contextId: string | null
  ): Promise<boolean> {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ context_id: contextId })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Refetch para atualizar o agrupamento
      if (conversationId) {
        await fetchContextMessages(conversationId);
      }

      return true;
    } catch (err) {
      console.error('Error updating message context:', err);
      setError(err as Error);
      return false;
    }
  }

  async function updateMultipleMessagesContext(
    messageIds: string[],
    contextId: string | null
  ): Promise<boolean> {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ context_id: contextId })
        .in('id', messageIds);

      if (updateError) throw updateError;

      // Refetch para atualizar o agrupamento
      if (conversationId) {
        await fetchContextMessages(conversationId);
      }

      return true;
    } catch (err) {
      console.error('Error updating multiple messages context:', err);
      setError(err as Error);
      return false;
    }
  }

  async function refetch() {
    if (conversationId) {
      await fetchContextMessages(conversationId);
    }
  }

  return {
    data,
    loading,
    error,
    updateMessageContext,
    updateMultipleMessagesContext,
    refetch,
  };
}
