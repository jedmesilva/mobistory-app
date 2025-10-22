import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type Conversation = Database['public']['Tables']['conversations']['Row']
type Vehicle = Database['public']['Tables']['vehicles']['Row']
type Brand = Database['public']['Tables']['brands']['Row']
type Model = Database['public']['Tables']['models']['Row']
type ModelVersion = Database['public']['Tables']['model_versions']['Row']
type Plate = Database['public']['Tables']['plates']['Row']

type Color = Database['public']['Tables']['colors']['Row']

export type ConversationWithVehicle = Conversation & {
  vehicles: Vehicle & {
    brands: Brand
    models: Model
    model_versions: ModelVersion | null
    plates: Plate[]
    colors: Color[]
  }
}

interface UseConversationParams {
  vehicleId: string | undefined
  entityId: string | undefined
}

export function useConversation({ vehicleId, entityId }: UseConversationParams) {
  const [conversation, setConversation] = useState<ConversationWithVehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (vehicleId && entityId) {
      fetchOrCreateConversation(vehicleId, entityId)
    } else {
      setConversation(null)
      setLoading(false)
    }
  }, [vehicleId, entityId])

  async function fetchOrCreateConversation(vehicleId: string, entityId: string) {
    try {
      setLoading(true)
      setError(null)

      // Tentar buscar conversa existente
      const { data: existingConversation, error: fetchError } = await supabase
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
            )
          )
        `)
        .eq('vehicle_id', vehicleId)
        .eq('entity_id', entityId)
        .eq('active', true)
        .single()

      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation)
        setConversation(existingConversation as ConversationWithVehicle)
        return
      }

      // Se não existir e o erro for "not found", criar nova conversa
      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('Creating new conversation for vehicle:', vehicleId, 'entity:', entityId)

        // Buscar dados do veículo para criar o título
        const { data: vehicleData } = await supabase
          .from('vehicles')
          .select(`
            *,
            brands (brand),
            models (model)
          `)
          .eq('id', vehicleId)
          .single()

        const title = vehicleData
          ? `Conversa sobre ${vehicleData.brands?.brand} ${vehicleData.models?.model}`
          : 'Nova conversa'

        // Criar nova conversa
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            vehicle_id: vehicleId,
            entity_id: entityId,
            title,
            status: 'active',
          })
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
              )
            )
          `)
          .single()

        if (createError) throw createError

        console.log('Created new conversation:', newConversation)
        setConversation(newConversation as ConversationWithVehicle)
        return
      }

      // Se houver outro erro, lançar
      if (fetchError) throw fetchError

    } catch (err) {
      setError(err as Error)
      console.error('Error fetching or creating conversation:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    if (vehicleId && entityId) {
      await fetchOrCreateConversation(vehicleId, entityId)
    }
  }

  return {
    conversation,
    loading,
    error,
    refetch,
  }
}
