import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type Entity = Database['public']['Tables']['entities']['Row']

export function useEntity(entityId?: string) {
  const [entity, setEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (entityId) {
      fetchEntity(entityId)
    } else {
      setEntity(null)
      setLoading(false)
    }
  }, [entityId])

  async function fetchEntity(entityId: string) {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('entities')
        .select('*')
        .eq('id', entityId)
        .single()

      if (fetchError) throw fetchError

      setEntity(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching entity:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    if (entityId) {
      await fetchEntity(entityId)
    }
  }

  return {
    entity,
    loading,
    error,
    refetch,
  }
}
