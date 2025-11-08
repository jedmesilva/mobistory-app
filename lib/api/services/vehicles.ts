import { api } from '../config';
import type {
  Vehicle,
  VehicleWithDetails,
  VehicleWithDetailsLegacy,
  VehicleCreateRequest,
  Brand,
  Model,
  ModelVersion,
  PlateModel,
  PlateType,
  PlateDetectionResult,
  Color,
  ColorCreateRequest
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

  /**
   * Obter vínculos de um veículo (incluindo histórico)
   */
  async getVehicleLinks(vehicleId: string): Promise<any[]> {
    try {
      const response = await api.get(`/vehicles/${vehicleId}/links`, {
        params: {
          active_only: false, // Incluir vínculos inativos para histórico completo
        }
      });
      return response.data?.links || [];
    } catch (error) {
      console.error(`Error fetching links for vehicle ${vehicleId}:`, error);
      throw error;
    }
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

export const plateModelsService = {
  /**
   * Listar modelos de placa
   */
  async list(params?: {
    country?: string;
    active_only?: boolean;
    include_expired?: boolean;
  }): Promise<PlateModel[]> {
    const response = await api.get<PlateModel[]>('/plate-models/', {
      params: {
        country: params?.country,
        active_only: params?.active_only ?? true,
        include_expired: params?.include_expired ?? false,
      }
    });
    return response.data;
  },

  /**
   * Obter um modelo de placa específico
   */
  async get(plateModelId: string): Promise<PlateModel> {
    const response = await api.get<PlateModel>(`/plate-models/${plateModelId}`);
    return response.data;
  },

  /**
   * Detectar modelo de placa baseado no número
   */
  async detect(plateNumber: string): Promise<PlateDetectionResult> {
    const response = await api.post<PlateDetectionResult>('/plate-models/detect', {
      plate_number: plateNumber
    });
    return response.data;
  },
};

export const plateTypesService = {
  /**
   * Listar tipos de placa
   */
  async list(params?: {
    plate_model_id?: string;
    vehicle_category?: string;
    active_only?: boolean;
  }): Promise<PlateType[]> {
    const response = await api.get<PlateType[]>('/plate-types/', {
      params: {
        plate_model_id: params?.plate_model_id,
        vehicle_category: params?.vehicle_category,
        active_only: params?.active_only ?? true,
      }
    });
    return response.data;
  },

  /**
   * Obter um tipo de placa específico
   */
  async get(plateTypeId: string): Promise<PlateType> {
    const response = await api.get<PlateType>(`/plate-types/${plateTypeId}`);
    return response.data;
  },
};

export const colorsService = {
  /**
   * Listar cores (apenas verificadas por padrão)
   */
  async list(params?: {
    verified_only?: boolean;
    active_only?: boolean;
    finish_type?: string;
  }): Promise<Color[]> {
    const response = await api.get<Color[]>('/colors/', {
      params: {
        verified_only: params?.verified_only ?? true,
        active_only: params?.active_only ?? true,
        finish_type: params?.finish_type,
      }
    });
    return response.data;
  },

  /**
   * Criar cor personalizada (criada como não verificada)
   */
  async create(data: ColorCreateRequest): Promise<Color> {
    const response = await api.post<Color>('/colors/', data);
    return response.data;
  },

  /**
   * Obter uma cor específica
   */
  async get(colorId: string): Promise<Color> {
    const response = await api.get<Color>(`/colors/${colorId}`);
    return response.data;
  },
};
