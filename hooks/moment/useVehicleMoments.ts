import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { MomentWithDetails } from './useMoments'

export function useVehicleMoments(vehicleId?: string) {
  const [moments, setMoments] = useState<MomentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleMoments(vehicleId)
    } else {
      setMoments([])
      setLoading(false)
    }
  }, [vehicleId])

  async function fetchVehicleMoments(vehicleId: string) {
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
            ),
            vehicle_images (
              id,
              image_url,
              is_primary,
              width,
              height
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
        .eq('vehicle_id', vehicleId)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setMoments(data as MomentWithDetails[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching vehicle moments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    if (vehicleId) {
      await fetchVehicleMoments(vehicleId)
    }
  }

  return {
    moments,
    loading,
    error,
    refetch,
  }
}
