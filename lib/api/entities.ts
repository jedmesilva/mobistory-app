import { api } from './config';
import { DeviceFingerprint } from '../utils/deviceFingerprint';

export interface Entity {
  id: string;
  entity_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  document_number: string | null;
  active: boolean;
  is_anonymous: boolean;
  verified: boolean;  // Entidade completamente validada
  created_at: string;
  updated_at: string;
}

export interface EntityCreate {
  name: string;
  email?: string;
  phone?: string;
  document_number?: string;
  active?: boolean;
}

export interface AnonymousEntityCreate {
  device_fingerprint: DeviceFingerprint | Record<string, any>;
  name?: string;
}

export interface EntityConvert {
  email?: string;
  phone?: string;
  document_number?: string;
  display_name?: string;
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

  async create(data: EntityCreate): Promise<Entity> {
    const response = await api.post<Entity>('/entities', data);
    return response.data;
  },

  async createAnonymous(data: AnonymousEntityCreate): Promise<Entity> {
    const response = await api.post<Entity>('/entities/anonymous', data);
    return response.data;
  },

  async convertAnonymous(
    entityId: string,
    data: EntityConvert
  ): Promise<Entity> {
    const params = new URLSearchParams();
    if (data.email) params.append('email', data.email);
    if (data.phone) params.append('phone', data.phone);
    if (data.document_number) params.append('document_number', data.document_number);
    if (data.display_name) params.append('display_name', data.display_name);

    const response = await api.post<Entity>(
      `/entities/${entityId}/convert?${params.toString()}`
    );
    return response.data;
  },
};
