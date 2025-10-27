import { api } from './config';
import { vehiclesService, type VehicleWithDetails } from './vehicles';

// Base types
export interface Moment {
  id: string;
  vehicle_id: string;
  entity_id: string;
  caption: string;
  type: string;
  location: string | null;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Entity {
  id: string;
  entity_type: string;
  name: string;
  email: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MomentImage {
  id: string;
  moment_id: string;
  image_url: string;
  image_order: number;
  width: number | null;
  height: number | null;
}

export interface MomentReaction {
  id: string;
  moment_id: string;
  entity_id: string;
  reaction_type: string;
}

export interface MomentComment {
  id: string;
  moment_id: string;
  entity_id: string;
  comment: string;
  parent_comment_id: string | null;
  created_at: string;
}

// Enriched type with related data
export interface MomentWithDetails extends Moment {
  vehicles: VehicleWithDetails;
  entities: Entity;
  moment_images: MomentImage[];
  moment_reactions: (MomentReaction & { entities: Entity })[];
  moment_comments: (MomentComment & { entities: Entity })[];
}

export const momentsService = {
  async getAll(): Promise<Moment[]> {
    const response = await api.get<Moment[]>('/moments');
    return response.data;
  },

  async getById(id: string): Promise<Moment> {
    const response = await api.get<Moment>(`/moments/${id}`);
    return response.data;
  },

  async getAllWithDetails(): Promise<MomentWithDetails[]> {
    // Fetch all data in parallel
    const [moments, vehicles, entities] = await Promise.all([
      this.getAll(),
      vehiclesService.getAllWithDetails(),
      api.get<Entity[]>('/entities').then(r => r.data),
    ]);

    // Create maps for quick lookups
    const vehicleMap = new Map(vehicles.map(v => [v.id, v]));
    const entityMap = new Map(entities.map(e => [e.id, e]));

    // Combine data
    return moments.map(moment => ({
      ...moment,
      vehicles: vehicleMap.get(moment.vehicle_id)!,
      entities: entityMap.get(moment.entity_id)!,
      moment_images: [], // These would need separate endpoints
      moment_reactions: [],
      moment_comments: [],
    }));
  },
};
