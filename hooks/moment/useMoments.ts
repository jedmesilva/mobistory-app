import { useState, useEffect } from 'react'
import { momentsService, type MomentWithDetails } from '@/lib/api/moments'

export type { MomentWithDetails }

// Stub: Não faz chamadas HTTP - retorna dados vazios
export function useMoments() {
  const [moments, setMoments] = useState<MomentWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function refetch() {
    console.log('useMoments.refetch called (stub)')
  }

  return {
    moments,
    loading,
    error,
    refetch,
  }
}

// Stub: Não faz chamadas HTTP - retorna dados vazios para um veículo específico
export function useVehicleMoments(vehicleId: string | undefined) {
  const [moments, setMoments] = useState<MomentWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function refetch() {
    console.log('useVehicleMoments.refetch called (stub)', vehicleId)
  }

  return {
    moments,
    loading,
    error,
    refetch,
  }
}
