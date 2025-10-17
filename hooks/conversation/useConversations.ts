import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { ConversationWithVehicle } from './useConversation';

export function useConversations(entityId: string | null | undefined) {
  const [conversations, setConversations] = useState<ConversationWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (entityId) {
      fetchConversations(entityId);
    } else {
      setConversations([]);
      setLoading(false);
    }
  }, [entityId]);

  async function fetchConversations(entityId: string) {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select(`
          *,
          vehicles (
            *,
            brands (
              id,
              brand
            ),
            models (
              id,
              model
            ),
            model_versions (
              id,
              version
            ),
            plates (
              id,
              plate,
              state,
              active
            ),
            colors (
              id,
              color,
              active
            )
          )
        `)
        .eq('entity_id', entityId)
        .eq('active', true)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (fetchError) throw fetchError;

      console.log('Conversations fetched:', {
        entityId,
        count: data?.length || 0,
        data
      });

      setConversations(data as ConversationWithVehicle[]);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refetch() {
    if (entityId) {
      await fetchConversations(entityId);
    }
  }

  return {
    conversations,
    loading,
    error,
    refetch,
  };
}
