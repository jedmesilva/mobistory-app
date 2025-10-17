import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type Message = Database['public']['Tables']['messages']['Row']
type Entity = Database['public']['Tables']['entities']['Row']

export type MessageWithSender = Message & {
  sender: Entity
}

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId)
    } else {
      setMessages([])
      setLoading(false)
    }
  }, [conversationId])

  async function fetchMessages(conversationId: string) {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:entities!messages_sender_id_fkey (
            id,
            entity_type,
            name,
            email,
            metadata
          )
        `)
        .eq('conversation_id', conversationId)
        .eq('deleted', false)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      console.log('Messages fetched:', {
        conversationId,
        count: data?.length || 0,
        data
      })

      setMessages(data as MessageWithSender[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(params: {
    conversationId: string
    senderId: string
    content: string
    messageType?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'system'
  }) {
    try {
      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.conversationId,
          sender_id: params.senderId,
          content: params.content,
          message_type: params.messageType || 'text',
          status: 'sent',
        })
        .select(`
          *,
          sender:entities!messages_sender_id_fkey (
            id,
            entity_type,
            name,
            email,
            metadata
          )
        `)
        .single()

      if (sendError) throw sendError

      // Adicionar a nova mensagem à lista
      setMessages(prev => [...prev, data as MessageWithSender])

      return data
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  async function refetch() {
    if (conversationId) {
      await fetchMessages(conversationId)
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch,
  }
}
