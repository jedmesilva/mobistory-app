import { api } from './config';
import type {
  Brand,
  Model,
  ModelVersion,
  EntityLink,
  Vehicle,
  VehicleWithDetails,
  VehicleWithDetailsLegacy,
  VehicleCreateRequest
} from './types';

// ============================================================================
// Re-export types for convenience
// ============================================================================
export type {
  Brand,
  Model,
  ModelVersion,
  EntityLink,
  Vehicle,
  VehicleWithDetails,
  VehicleWithDetailsLegacy,
  VehicleCreateRequest
};

/**
 * Converte VehicleWithDetails do novo formato para o formato legacy
 * Usado para compatibilidade com código antigo da UI
 */
export function convertToLegacyFormat(vehicle: VehicleWithDetails): VehicleWithDetailsLegacy {
  return {
    id: vehicle.id,
    brand_id: vehicle.brand_id,
    model_id: vehicle.model_id,
    version_id: vehicle.version_id,
    chassis: vehicle.vin || vehicle.renavam || '',
    model_year: vehicle.model_year || 0,
    manufacture_year: vehicle.manufacturing_year || 0,

    // Converter relacionamentos para formato antigo
    brands: {
      brand: vehicle.brand?.name || 'Marca desconhecida'
    },
    models: {
      model: vehicle.model?.name || 'Modelo desconhecido'
    },
    model_versions: vehicle.version ? {
      version: vehicle.version.name
    } : null,

    // Converter campos simples para arrays (compatibilidade)
    plates: vehicle.current_plate ? [{
      plate: vehicle.current_plate,
      active: true
    }] : [],
    colors: vehicle.current_color ? [{
      color: vehicle.current_color,
      active: true
    }] : [],

    // Manter links
    vehicle_entity_links: vehicle.entity_links || []
  };
}
