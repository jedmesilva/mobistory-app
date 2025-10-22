import { useState, useEffect, useCallback } from 'react';
import { maintenanceService, type MaintenanceFilters } from '../services';
import type { Maintenance, MaintenanceCreateRequest } from '../types';

export const useMaintenance = (filters?: MaintenanceFilters) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalCost: number;
    count: number;
    byType: Record<string, number>;
  } | null>(null);

  const loadMaintenances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await maintenanceService.list(filters);
      setMaintenances(data);

      // Calcular estatísticas se houver vehicleId
      if (filters?.vehicleId) {
        const statsData = await maintenanceService.getStats(
          filters.vehicleId,
          filters.dateStart,
          filters.dateEnd
        );
        setStats(statsData);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load maintenances';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadMaintenances();
  }, [loadMaintenances]);

  const createMaintenance = async (data: MaintenanceCreateRequest) => {
    try {
      const newMaintenance = await maintenanceService.create(data);
      await loadMaintenances(); // Recarregar lista e stats
      return newMaintenance;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create maintenance';
      throw new Error(message);
    }
  };

  const updateMaintenance = async (id: string, data: Partial<MaintenanceCreateRequest>) => {
    try {
      const updated = await maintenanceService.update(id, data);
      await loadMaintenances(); // Recarregar lista e stats
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to update maintenance';
      throw new Error(message);
    }
  };

  const deleteMaintenance = async (id: string) => {
    try {
      await maintenanceService.delete(id);
      await loadMaintenances(); // Recarregar lista e stats
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete maintenance';
      throw new Error(message);
    }
  };

  return {
    maintenances,
    stats,
    loading,
    error,
    loadMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
  };
};
