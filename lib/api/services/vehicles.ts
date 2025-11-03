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
   * Listar marcas (apenas verificadas por padrão)
   */
  async listBrands(verifiedOnly: boolean = true): Promise<Brand[]> {
    const response = await api.get<Brand[]>('/brands', {
      params: {
        verified_only: verifiedOnly,
        active_only: true,
      }
    });
    return response.data;
  },

  /**
   * Criar marca (criada como não verificada)
   */
  async createBrand(name: string, countryOfOrigin?: string): Promise<Brand> {
    const response = await api.post<Brand>('/brands', {
      name,
      country_of_origin: countryOfOrigin,
    });
    return response.data;
  },

  /**
   * Listar modelos de uma marca específica (apenas verificados por padrão)
   */
  async listModels(brandId: string, verifiedOnly: boolean = true): Promise<Model[]> {
    const response = await api.get<Model[]>(`/brands/${brandId}/models`, {
      params: {
        verified_only: verifiedOnly,
        active_only: true,
      }
    });
    return response.data;
  },

  /**
   * Criar modelo para uma marca (criado como não verificado)
   */
  async createModel(brandId: string, name: string, category?: string): Promise<Model> {
    const response = await api.post<Model>(`/brands/${brandId}/models`, {
      name,
      brand_id: brandId,
      category,
    });
    return response.data;
  },

  /**
   * Listar versões de um modelo específico (apenas verificadas por padrão)
   */
  async listVersions(brandId: string, modelId: string, verifiedOnly: boolean = true): Promise<ModelVersion[]> {
    const response = await api.get<ModelVersion[]>(`/brands/${brandId}/models/${modelId}/versions`, {
      params: {
        verified_only: verifiedOnly,
        active_only: true,
      }
    });
    return response.data;
  },

  /**
   * Criar versão para um modelo (criada como não verificada)
   */
  async createVersion(
    brandId: string,
    modelId: string,
    name: string,
    specs?: {
      fuel_type?: string;
      transmission?: string;
      engine_power?: number;
      doors?: number;
      seats?: number;
      tank_capacity_liters?: number;
    }
  ): Promise<ModelVersion> {
    const response = await api.post<ModelVersion>(`/brands/${brandId}/models/${modelId}/versions`, {
      name,
      model_id: modelId,
      ...specs,
    });
    return response.data;
  },
};
