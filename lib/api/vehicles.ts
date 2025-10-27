import { api } from './config';

export interface Vehicle {
  id: string;
  brand_id: string;
  model_id: string;
  version_id: string | null;
  category_id: string;
  chassis: string;
  model_year: number;
  manufacture_year: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  brand: string;
  verified?: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Model {
  id: string;
  brand_id?: string;
  model: string;
  verified?: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleWithDetails extends Vehicle {
  brands: Brand;
  models: Model;
  model_versions: {
    id: string;
    version: string;
  } | null;
  vehicle_categories: {
    id: string;
    category: string;
  };
  plates: Array<{
    id: string;
    plate: string;
    state: string;
    active: boolean;
  }>;
  colors: Array<{
    id: string;
    color: string;
    active: boolean;
  }>;
  vehicle_fuels: Array<{
    id: string;
    active: boolean;
    fuels: {
      id: string;
      name: string;
      type: string;
    };
  }>;
}

export const vehiclesService = {
  async getAll(): Promise<Vehicle[]> {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  async getAllWithDetails(): Promise<VehicleWithDetails[]> {
    const response = await api.get<VehicleWithDetails[]>('/vehicles-with-details');
    return response.data;
  },

  async getById(id: string): Promise<Vehicle> {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  async getByIdWithDetails(id: string): Promise<VehicleWithDetails> {
    const response = await api.get<VehicleWithDetails>(`/vehicles-with-details/${id}`);
    return response.data;
  },

  async getVehicleLinks(id: string): Promise<any[]> {
    try {
      // TODO: Implementar quando endpoint estiver pronto
      // const response = await api.get(`/vehicles/${id}/links`);
      // return response.data.links;
      
      // Mock data por enquanto
      return [
        {
          id: '1',
          entity: {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@email.com',
            entity_type: 'person'
          },
          relationship_type: 'owner',
          status: 'active',
          start_date: '2024-01-15',
          created_at: '2024-01-15',
        },
        {
          id: '2',
          entity: {
            id: '2',
            name: 'Maria Santos',
            email: 'maria.santos@email.com',
            entity_type: 'person'
          },
          relationship_type: 'authorized_driver',
          status: 'active',
          start_date: '2024-03-20',
          created_at: '2024-03-20',
        },
        {
          id: '3',
          entity: {
            id: '3',
            name: 'Pedro Costa',
            email: 'pedro.costa@email.com',
            entity_type: 'person'
          },
          relationship_type: 'renter',
          status: 'terminated',
          start_date: '2023-06-10',
          created_at: '2023-06-10',
        },
      ];
    } catch (error) {
      console.error('Error fetching vehicle links:', error);
      return [];
    }
  },

  async getBrands(): Promise<Brand[]> {
    const response = await api.get<Brand[]>('/brands');
    return response.data;
  },

  async getModels(): Promise<Model[]> {
    const response = await api.get<Model[]>('/models');
    return response.data;
  },
};
