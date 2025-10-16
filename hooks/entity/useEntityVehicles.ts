import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type VehicleEntityLink = Database['public']['Tables']['vehicle_entity_links']['Row']
type Vehicle = Database['public']['Tables']['vehicles']['Row']
type Brand = Database['public']['Tables']['brands']['Row']
type Model = Database['public']['Tables']['models']['Row']
type ModelVersion = Database['public']['Tables']['model_versions']['Row']
type VehicleCategory = Database['public']['Tables']['vehicle_categories']['Row']
type Plate = Database['public']['Tables']['plates']['Row']
type Color = Database['public']['Tables']['colors']['Row']
type VehicleFuel = Database['public']['Tables']['vehicle_fuels']['Row']
type Fuel = Database['public']['Tables']['fuels']['Row']

export type EntityVehicleLink = VehicleEntityLink & {
  vehicles: Vehicle & {
    brands: Brand
    models: Model
    model_versions: ModelVersion | null
    vehicle_categories: VehicleCategory
    plates: Plate[]
    colors: Color[]
    vehicle_fuels: (VehicleFuel & {
      fuels: Fuel
    })[]
  }
}

export function useEntityVehicles(entityId?: string) {
  const [vehicleLinks, setVehicleLinks] = useState<EntityVehicleLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (entityId) {
      fetchEntityVehicles(entityId)
    } else {
      setVehicleLinks([])
      setLoading(false)
    }
  }, [entityId])

  async function fetchEntityVehicles(entityId: string) {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('vehicle_entity_links')
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
          )
        `)
        .eq('entity_id', entityId)
        .eq('active', true)
        .order('start_date', { ascending: false })

      if (fetchError) throw fetchError

      setVehicleLinks(data as EntityVehicleLink[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching entity vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    if (entityId) {
      await fetchEntityVehicles(entityId)
    }
  }

  return {
    vehicleLinks,
    loading,
    error,
    refetch,
  }
}
