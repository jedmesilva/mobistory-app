import { api } from '../config';
import type { Fueling, FuelingCreateRequest } from '../types';

export interface FuelingFilters {
  vehicleId?: string;
  dateStart?: string;
  dateEnd?: string;
  fuelType?: string;
  skip?: number;
  limit?: number;
}

export const fuelingService = {
  /**
   * Listar abastecimentos
   */
  async list(filters?: FuelingFilters): Promise<Fueling[]> {
    const params: any = {};

    if (filters?.vehicleId) params.vehicle_id = filters.vehicleId;
    if (filters?.dateStart) params.date_start = filters.dateStart;
    if (filters?.dateEnd) params.date_end = filters.dateEnd;
    if (filters?.fuelType) params.fuel_type = filters.fuelType;
    if (filters?.skip) params.skip = filters.skip;
    if (filters?.limit) params.limit = filters.limit;

    const response = await api.get<Fueling[]>('/fueling', { params });
    return response.data;
  },

  /**
   * Criar registro de abastecimento
   */
  async create(data: FuelingCreateRequest): Promise<Fueling> {
    const response = await api.post<Fueling>('/fueling', data);
    return response.data;
  },

  /**
   * Obter detalhes de um abastecimento
   */
  async get(id: string): Promise<Fueling> {
    const response = await api.get<Fueling>(`/fueling/${id}`);
    return response.data;
  },

  /**
   * Atualizar abastecimento
   */
  async update(id: string, data: Partial<FuelingCreateRequest>): Promise<Fueling> {
    const response = await api.put<Fueling>(`/fueling/${id}`, data);
    return response.data;
  },

  /**
   * Deletar abastecimento
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/fueling/${id}`);
  },

  /**
   * Calcular estatísticas de abastecimento
   */
  async getStats(vehicleId: string, dateStart?: string, dateEnd?: string) {
    const fuelings = await this.list({
      vehicleId,
      dateStart,
      dateEnd,
    });

    if (fuelings.length === 0) {
      return {
        totalLiters: 0,
        totalCost: 0,
        averagePricePerLiter: 0,
        count: 0,
      };
    }

    const totalLiters = fuelings.reduce((sum, f) => sum + (f.liters || 0), 0);
    const totalCost = fuelings.reduce((sum, f) => sum + (f.total_price || 0), 0);
    const avgPrice = totalCost / totalLiters;

    return {
      totalLiters,
      totalCost,
      averagePricePerLiter: avgPrice,
      count: fuelings.length,
    };
  },
};
