import { vehiclesService, type VehicleWithDetails } from '@/lib/api/vehicles';
import { useEffect, useState } from 'react';

// Hook para buscar todos os veículos
export function useVehicles() {
  const [vehicles, setVehicles] = useState<VehicleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      setLoading(true);
      setError(null);
      const data = await vehiclesService.getAllWithDetails();
      setVehicles(data);
      console.log('✅ Vehicles loaded from backend:', data.length);
    } catch (err) {
      setError(err as Error);
      console.error('❌ Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refetch() {
    await fetchVehicles();
  }

  return {
    vehicles,
    loading,
    error,
    refetch,
  };
}

// Hook para buscar um veículo específico por ID
export function useVehicle(vehicleId: string | undefined) {
  const [vehicle, setVehicle] = useState<VehicleWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  async function fetchVehicle() {
    if (!vehicleId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await vehiclesService.getByIdWithDetails(vehicleId);
      setVehicle(data);
      console.log('✅ Vehicle with details loaded from backend:', vehicleId);
    } catch (err) {
      setError(err as Error);
      console.error('❌ Error fetching vehicle:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refetch() {
    await fetchVehicle();
  }

  return {
    vehicle,
    loading,
    error,
    refetch,
  };
}
