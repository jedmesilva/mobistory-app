import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database/types'

type Vehicle = Database['public']['Tables']['vehicles']['Row']
type Brand = Database['public']['Tables']['brands']['Row']
type Model = Database['public']['Tables']['models']['Row']
type ModelVersion = Database['public']['Tables']['model_versions']['Row']
type VehicleCategory = Database['public']['Tables']['vehicle_categories']['Row']
type Plate = Database['public']['Tables']['plates']['Row']
type Color = Database['public']['Tables']['colors']['Row']
type VehicleFuel = Database['public']['Tables']['vehicle_fuels']['Row']
type Fuel = Database['public']['Tables']['fuels']['Row']
type VehicleEntityLink = Database['public']['Tables']['vehicle_entity_links']['Row']
type Entity = Database['public']['Tables']['entities']['Row']

export type VehicleWithLinksAndDetails = Vehicle & {
  brands: Brand
  models: Model
  model_versions: ModelVersion | null
  vehicle_categories: VehicleCategory
  plates: Plate[]
  colors: Color[]
  vehicle_fuels: (VehicleFuel & {
    fuels: Fuel
  })[]
  vehicle_entity_links: (VehicleEntityLink & {
    entities: Entity
  })[]
}

export function useVehiclesWithLinks() {
  const [vehicles, setVehicles] = useState<VehicleWithLinksAndDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchVehiclesWithLinks()
  }, [])

  async function fetchVehiclesWithLinks() {
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
          ),
          vehicle_entity_links (
            id,
            entity_id,
            relationship_type,
            permissions,
            status,
            start_date,
            end_date,
            notes,
            active,
            entities!vehicle_entity_links_entity_id_fkey (
              id,
              entity_type,
              name,
              email,
              phone,
              document_number
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setVehicles(data as VehicleWithLinksAndDetails[])
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching vehicles with links:', err)
    } finally {
      setLoading(false)
    }
  }

  async function refetch() {
    await fetchVehiclesWithLinks()
  }

  return {
    vehicles,
    loading,
    error,
    refetch,
  }
}
