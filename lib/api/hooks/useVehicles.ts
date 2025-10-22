import { useState, useEffect, useCallback } from 'react';
import { vehiclesService, catalogService } from '../services';
import type { VehicleWithDetails, VehicleCreateRequest, Brand, Model, ModelVersion } from '../types';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await vehiclesService.list();
      setVehicles(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load vehicles';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const createVehicle = async (data: VehicleCreateRequest) => {
    try {
      const newVehicle = await vehiclesService.create(data);
      await loadVehicles(); // Recarregar lista
      return newVehicle;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create vehicle';
      throw new Error(message);
    }
  };

  const updateVehicle = async (id: string, data: Partial<VehicleCreateRequest>) => {
    try {
      const updated = await vehiclesService.update(id, data);
      await loadVehicles(); // Recarregar lista
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to update vehicle';
      throw new Error(message);
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehiclesService.delete(id);
      await loadVehicles(); // Recarregar lista
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to delete vehicle';
      throw new Error(message);
    }
  };

  return {
    vehicles,
    loading,
    error,
    loadVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};

export const useCatalog = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBrands = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await catalogService.listBrands();
      setBrands(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load brands';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async (brandId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await catalogService.listModels(brandId);
      setModels(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load models';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async (modelId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await catalogService.listVersions(modelId);
      setVersions(data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load versions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return {
    brands,
    models,
    versions,
    loading,
    error,
    loadBrands,
    loadModels,
    loadVersions,
  };
};
