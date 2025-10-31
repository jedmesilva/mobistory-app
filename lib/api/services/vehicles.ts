import { api } from '../config';
import type {
  Vehicle,
  VehicleWithDetails,
  VehicleWithDetailsLegacy,
  VehicleCreateRequest,
  Brand,
  Model,
  ModelVersion
} from '../types';

// Re-exportar do arquivo vehicles.ts se existir, ou usar tipos locais
import { convertToLegacyFormat } from '../vehicles';

export const vehiclesService = {
  /**
   * Listar veículos do usuário com detalhes
   */
  async list(): Promise<VehicleWithDetailsLegacy[]> {
    try {
      // Buscar veículos
      const response = await api.get<VehicleWithDetails[]>('/vehicles/');
      const vehicles = response.data;

      // Para cada veículo, buscar os links
      const vehiclesWithLinks = await Promise.all(
        vehicles.map(async (vehicle) => {
          try {
            const linksResponse = await api.get(`/vehicles/${vehicle.id}/links`);
            vehicle.entity_links = linksResponse.data?.links || [];
          } catch (error) {
            console.warn(`Failed to fetch links for vehicle ${vehicle.id}:`, error);
            vehicle.entity_links = [];
          }
          return vehicle;
        })
      );

      // Converter para formato legacy
      return vehiclesWithLinks.map(convertToLegacyFormat);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  /**
   * Criar novo veículo
   */
  async create(data: VehicleCreateRequest): Promise<Vehicle> {
    const response = await api.post<Vehicle>('/vehicles/', data);
    return response.data;
  },

  /**
   * Obter detalhes de um veículo
   */
  async get(id: string): Promise<VehicleWithDetailsLegacy> {
    try {
      // Buscar veículo
      const response = await api.get<VehicleWithDetails>(`/vehicles/${id}`);
      const vehicle = response.data;

      // Buscar links
      try {
        const linksResponse = await api.get(`/vehicles/${id}/links`);
        vehicle.entity_links = linksResponse.data?.links || [];
      } catch (error) {
        console.warn(`Failed to fetch links for vehicle ${id}:`, error);
        vehicle.entity_links = [];
      }

      // Converter para formato legacy
      return convertToLegacyFormat(vehicle);
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualizar veículo (parcial)
   */
  async update(id: string, data: Partial<VehicleCreateRequest>): Promise<Vehicle> {
    const response = await api.patch<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Deletar veículo (soft delete)
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
