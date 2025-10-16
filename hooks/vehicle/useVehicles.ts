import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { VehicleWithDetails } from '@/types/database/types'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<VehicleWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function fetchVehicles() {
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
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setVehicles(data as VehicleWithDetails[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    await fetchVehicles()
  }

  return {
    vehicles,
    loading,
    error,
    refetch,
  }
}
