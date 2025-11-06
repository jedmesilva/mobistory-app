import { useState, useEffect, useCallback } from 'react';
import { catalogService } from '@/lib/api/services/vehicles';
import type { Brand, Model, ModelVersion } from '@/lib/api/types';

/**
 * Hook para gerenciar o catálogo de veículos (brands, models, versions)
 * Usado no fluxo de cadastro de veículos
 */
export function useVehicleCatalog() {
  // Brands
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Models
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // Versions
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ModelVersion | null>(null);

  /**
   * Carregar marcas (apenas verificadas)
   */
  const loadBrands = useCallback(async () => {
    setLoadingBrands(true);
    try {
      const data = await catalogService.listBrands(true); // verified_only=true
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  }, []);

  /**
   * Carregar modelos de uma marca específica (incluindo não verificados)
   */
  const loadModels = useCallback(async (brandId: string) => {
    setLoadingModels(true);
    try {
      const data = await catalogService.listModels(brandId, false); // verified_only=false - mostrar todos
      setModels(data);
    } catch (error) {
      console.error('Error loading models:', error);
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  }, []);

  /**
   * Carregar versões de um modelo específico (incluindo não verificadas)
   */
  const loadVersions = useCallback(async (brandId: string, modelId: string) => {
    setLoadingVersions(true);
    try {
      const data = await catalogService.listVersions(brandId, modelId, false); // verified_only=false - mostrar todos
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  }, []);

  /**
   * Criar ou selecionar marca
   * Se a marca não existir na lista, cria uma nova (não verificada)
   */
  const selectOrCreateBrand = useCallback(async (brandName: string): Promise<Brand> => {
    // Buscar marca existente (case-insensitive)
    const existing = brands.find(b =>
      b.name.toLowerCase() === brandName.toLowerCase()
    );

    if (existing) {
      setSelectedBrand(existing);
      return existing;
    }

    // Criar nova marca (será criada como não verificada)
    try {
      const newBrand = await catalogService.createBrand(brandName);
      setBrands(prev => [...prev, newBrand]);
      setSelectedBrand(newBrand);
      return newBrand;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }, [brands]);

  /**
   * Criar ou selecionar modelo
   * Se o modelo não existir na lista, cria um novo (não verificado)
   */
  const selectOrCreateModel = useCallback(async (
    brandId: string,
    modelName: string,
    category?: string
  ): Promise<Model> => {
    // Buscar modelo existente (case-insensitive)
    const existing = models.find(m =>
      m.name.toLowerCase() === modelName.toLowerCase()
    );

    if (existing) {
      setSelectedModel(existing);
      return existing;
    }

    // Criar novo modelo (será criado como não verificado)
    try {
      const newModel = await catalogService.createModel(brandId, modelName, category);
      setModels(prev => [...prev, newModel]);
      setSelectedModel(newModel);
      return newModel;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  }, [models]);

  /**
   * Criar ou selecionar versão
   * Se a versão não existir na lista, cria uma nova (não verificada)
   */
  const selectOrCreateVersion = useCallback(async (
    brandId: string,
    modelId: string,
    versionName: string,
    specs?: {
      fuel_type?: string;
      transmission?: string;
      engine_power?: number;
      doors?: number;
      seats?: number;
      tank_capacity_liters?: number;
    }
  ): Promise<ModelVersion> => {
    // Buscar versão existente (case-insensitive)
    const existing = versions.find(v =>
      v.name.toLowerCase() === versionName.toLowerCase()
    );

    if (existing) {
      setSelectedVersion(existing);
      return existing;
    }

    // Criar nova versão (será criada como não verificada)
    try {
      const newVersion = await catalogService.createVersion(brandId, modelId, versionName, specs);
      setVersions(prev => [...prev, newVersion]);
      setSelectedVersion(newVersion);
      return newVersion;
    } catch (error) {
      console.error('Error creating version:', error);
      throw error;
    }
  }, [versions]);

  /**
   * Resetar seleção de modelo (quando trocar de marca)
   */
  const resetModel = useCallback(() => {
    setSelectedModel(null);
    setModels([]);
  }, []);

  /**
   * Resetar seleção de versão (quando trocar de modelo)
   */
  const resetVersion = useCallback(() => {
    setSelectedVersion(null);
    setVersions([]);
  }, []);

  /**
   * Carregar marcas ao montar
   */
  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  return {
    // Brands
    brands,
    loadingBrands,
    selectedBrand,
    setSelectedBrand,
    selectOrCreateBrand,

    // Models
    models,
    loadingModels,
    selectedModel,
    setSelectedModel,
    loadModels,
    selectOrCreateModel,
    resetModel,

    // Versions
    versions,
    loadingVersions,
    selectedVersion,
    setSelectedVersion,
    loadVersions,
    selectOrCreateVersion,
    resetVersion,
  };
}
