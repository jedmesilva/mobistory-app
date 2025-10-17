import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type VehicleEntityLink = Database['public']['Tables']['vehicle_entity_links']['Row']
type Entity = Database['public']['Tables']['entities']['Row']

export type VehicleLinkWithDetails = VehicleEntityLink & {
  entities: Entity
}

export function useVehicleLinks(vehicleId: string | undefined) {
  const [links, setLinks] = useState<VehicleLinkWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleLinks(vehicleId)
    } else {
      setLinks([])
      setLoading(false)
    }
  }, [vehicleId])

  async function fetchVehicleLinks(vehicleId: string) {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('vehicle_entity_links')
        .select(`
          *,
          entities!vehicle_entity_links_entity_id_fkey (
            id,
            entity_type,
            name,
            email,
            phone,
            document_number,
            metadata,
            active,
            created_at
          )
        `)
        .eq('vehicle_id', vehicleId)
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      console.log('Vehicle Links fetched:', {
        vehicleId,
        count: data?.length || 0,
        data
      })

      setLinks(data as VehicleLinkWithDetails[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching vehicle links:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    if (vehicleId) {
      await fetchVehicleLinks(vehicleId)
    }
  }

  return {
    links,
    loading,
    error,
    refetch,
  }
}
