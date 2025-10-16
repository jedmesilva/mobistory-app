import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { VehicleWithDetails } from '@/types/database/types'

export function useVehicle(vehicleId: string | undefined) {
  const [vehicle, setVehicle] = useState<VehicleWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle(vehicleId)
    }
  }, [vehicleId])

  async function fetchVehicle(id: string) {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('vehicles')
        .select(`
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
          vehicle_categories (
            id,
            category
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
          ),
          vehicle_fuels (
            id,
            active,
            fuels (
              id,
              name,
              type
            )
          )
        `)
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      setVehicle(data as VehicleWithDetails)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching vehicle:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    if (vehicleId) {
      await fetchVehicle(vehicleId)
    }
  }

  return {
    vehicle,
    loading,
    error,
    refetch,
  }
}
