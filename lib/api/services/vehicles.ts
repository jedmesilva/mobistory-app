import { api } from '../config';
import type { Vehicle, VehicleWithDetails, VehicleCreateRequest, Brand, Model, ModelVersion } from '../types';

export const vehiclesService = {
  /**
   * Listar veículos do usuário
   */
  async list(): Promise<VehicleWithDetails[]> {
    const response = await api.get<VehicleWithDetails[]>('/vehicles');
    return response.data;
  },

  /**
   * Criar novo veículo
   */
  async create(data: VehicleCreateRequest): Promise<Vehicle> {
    const response = await api.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  /**
   * Obter detalhes de um veículo
   */
  async get(id: string): Promise<VehicleWithDetails> {
    const response = await api.get<VehicleWithDetails>(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Atualizar veículo
   */
  async update(id: string, data: Partial<VehicleCreateRequest>): Promise<Vehicle> {
    const response = await api.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Deletar veículo
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },
};

export const catalogService = {
  /**
   * Listar marcas
   */
  async listBrands(): Promise<Brand[]> {
    const response = await api.get<Brand[]>('/catalog/brands');
    return response.data;
  },

  /**
   * Criar marca
   */
  async createBrand(brand: string): Promise<Brand> {
    const response = await api.post<Brand>('/catalog/brands', { brand });
    return response.data;
  },

  /**
   * Listar modelos (opcionalmente filtrar por marca)
   */
  async listModels(brandId?: string): Promise<Model[]> {
    const params = brandId ? { brand_id: brandId } : {};
    const response = await api.get<Model[]>('/catalog/models', { params });
    return response.data;
  },

  /**
   * Criar modelo
   */
  async createModel(brandId: string, model: string): Promise<Model> {
    const response = await api.post<Model>('/catalog/models', { brand_id: brandId, model });
    return response.data;
  },

  /**
   * Listar versões (opcionalmente filtrar por modelo)
   */
  async listVersions(modelId?: string): Promise<ModelVersion[]> {
    const params = modelId ? { model_id: modelId } : {};
    const response = await api.get<ModelVersion[]>('/catalog/versions', { params });
    return response.data;
  },

  /**
   * Criar versão
   */
  async createVersion(modelId: string, version: string): Promise<ModelVersion> {
    const response = await api.post<ModelVersion>('/catalog/versions', { model_id: modelId, version });
    return response.data;
  },
};
