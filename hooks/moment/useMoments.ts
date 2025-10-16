import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type Moment = Database['public']['Tables']['moments']['Row']
type MomentImage = Database['public']['Tables']['moment_images']['Row']
type MomentReaction = Database['public']['Tables']['moment_reactions']['Row']
type MomentComment = Database['public']['Tables']['moment_comments']['Row']
type Vehicle = Database['public']['Tables']['vehicles']['Row']
type Brand = Database['public']['Tables']['brands']['Row']
type Model = Database['public']['Tables']['models']['Row']
type ModelVersion = Database['public']['Tables']['model_versions']['Row']
type Entity = Database['public']['Tables']['entities']['Row']
type Plate = Database['public']['Tables']['plates']['Row']

export type MomentWithDetails = Moment & {
  vehicles: Vehicle & {
    brands: Brand
    models: Model
    model_versions: ModelVersion | null
    plates: Plate[]
  }
  entities: Entity
  moment_images: MomentImage[]
  moment_reactions: (MomentReaction & {
    entities: Entity
  })[]
  moment_comments: (MomentComment & {
    entities: Entity
  })[]
}

export function useMoments() {
  const [moments, setMoments] = useState<MomentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchMoments()
  }, [])

  async function fetchMoments() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('moments')
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
          ),
          entities!moments_entity_id_fkey (
            id,
            entity_type,
            name,
            email
          ),
          moment_images (
            id,
            image_url,
            image_order,
            width,
            height
          ),
          moment_reactions (
            id,
            reaction_type,
            entities!moment_reactions_entity_id_fkey (
              id,
              name
            )
          ),
          moment_comments (
            id,
            comment,
            parent_comment_id,
            created_at,
            entities!moment_comments_entity_id_fkey (
              id,
              name
            )
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setMoments(data as MomentWithDetails[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching moments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    await fetchMoments()
  }

  return {
    moments,
    loading,
    error,
    refetch,
  }
}
