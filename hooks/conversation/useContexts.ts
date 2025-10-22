import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type {
  ConversationContext,
  CreateContextParams,
  UpdateContextParams,
} from '@/types/conversation-context';

export function useContexts(conversationId: string | undefined) {
  const [contexts, setContexts] = useState<ConversationContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchContexts(conversationId);
    } else {
      setContexts([]);
      setLoading(false);
    }
  }, [conversationId]);

  async function fetchContexts(conversationId: string) {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('conversation_contexts')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('active', true)
        .order('started_at', { ascending: false });

      if (fetchError) throw fetchError;

      setContexts(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching contexts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createContext(params: CreateContextParams): Promise<ConversationContext | null> {
    try {
      const { data, error: createError } = await supabase
        .from('conversation_contexts')
        .insert({
          ...params,
          started_at: params.started_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;

      // Atualizar lista local
      if (data) {
        setContexts(prev => [data, ...prev]);
      }

      return data;
    } catch (err) {
      console.error('Error creating context:', err);
      setError(err as Error);
      return null;
    }
  }

  async function updateContext(
    contextId: string,
    params: UpdateContextParams
  ): Promise<ConversationContext | null> {
    try {
      const { data, error: updateError } = await supabase
        .from('conversation_contexts')
        .update(params)
        .eq('id', contextId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Atualizar lista local
      if (data) {
        setContexts(prev =>
          prev.map(context => (context.id === contextId ? data : context))
        );
      }

      return data;
    } catch (err) {
      console.error('Error updating context:', err);
      setError(err as Error);
      return null;
    }
  }

  async function deleteContext(contextId: string): Promise<boolean> {
    try {
      // Soft delete
      const { error: deleteError } = await supabase
        .from('conversation_contexts')
        .update({ active: false })
        .eq('id', contextId);

      if (deleteError) throw deleteError;

      // Atualizar lista local
      setContexts(prev => prev.filter(context => context.id !== contextId));

      return true;
    } catch (err) {
      console.error('Error deleting context:', err);
      setError(err as Error);
      return false;
    }
  }

  async function refetch() {
    if (conversationId) {
      await fetchContexts(conversationId);
    }
  }

  return {
    contexts,
    loading,
    error,
    createContext,
    updateContext,
    deleteContext,
    refetch,
  };
}
