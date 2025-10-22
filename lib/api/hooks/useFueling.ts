import { useState, useEffect, useCallback } from 'react';
import { fuelingService, type FuelingFilters } from '../services';
import type { Fueling, FuelingCreateRequest } from '../types';

export const useFueling = (filters?: FuelingFilters) => {
  const [fuelings, setFuelings] = useState<Fueling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalLiters: number;
    totalCost: number;
    averagePricePerLiter: number;
    count: number;
  } | null>(null);

  const loadFuelings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fuelingService.list(filters);
      setFuelings(data);

      // Calcular estatísticas se houver vehicleId
      if (filters?.vehicleId) {
        const statsData = await fuelingService.getStats(
          filters.vehicleId,
          filters.dateStart,
          filters.dateEnd
        );
        setStats(statsData);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load fuelings';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFuelings();
  }, [loadFuelings]);

  const createFueling = async (data: FuelingCreateRequest) => {
    try {
      const newFueling = await fuelingService.create(data);
      await loadFuelings(); // Recarregar lista e stats
      return newFueling;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create fueling';
      throw new Error(message);
    }
  };

  const updateFueling = async (id: string, data: Partial<FuelingCreateRequest>) => {
    try {
      const updated = await fuelingService.update(id, data);
      await loadFuelings(); // Recarregar lista e stats
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to update fueling';
      throw new Error(message);
    }
  };

  const deleteFueling = async (id: string) => {
    try {
      await fuelingService.delete(id);
      await loadFuelings(); // Recarregar lista e stats
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete fueling';
      throw new Error(message);
    }
  };

  return {
    fuelings,
    stats,
    loading,
    error,
    loadFuelings,
    createFueling,
    updateFueling,
    deleteFueling,
  };
};
