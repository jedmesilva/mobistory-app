import { api } from './config';

export interface Entity {
  id: string;
  entity_type: string;
  name: string;
  email: string | null;
  phone: string | null;
  document_number: string | null;
  ai_model: string | null;
  ai_capabilities: any;
  device_serial: string | null;
  device_type: string | null;
  legal_id: string | null;
  organization_type: string | null;
  metadata: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const entitiesService = {
  async getAll(): Promise<Entity[]> {
    const response = await api.get<Entity[]>('/entities');
    return response.data;
  },

  async getById(id: string): Promise<Entity> {
    const response = await api.get<Entity>(`/entities/${id}`);
    return response.data;
  },
};
