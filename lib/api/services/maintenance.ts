import { api } from '../config';
import type { Maintenance, MaintenanceCreateRequest } from '../types';

export interface MaintenanceFilters {
  vehicleId?: string;
  dateStart?: string;
  dateEnd?: string;
  maintenanceType?: string;
  skip?: number;
  limit?: number;
}

export const maintenanceService = {
  /**
   * Listar manutenções
   */
  async list(filters?: MaintenanceFilters): Promise<Maintenance[]> {
    const params: any = {};

    if (filters?.vehicleId) params.vehicle_id = filters.vehicleId;
    if (filters?.dateStart) params.date_start = filters.dateStart;
    if (filters?.dateEnd) params.date_end = filters.dateEnd;
    if (filters?.maintenanceType) params.maintenance_type = filters.maintenanceType;
    if (filters?.skip) params.skip = filters.skip;
    if (filters?.limit) params.limit = filters.limit;

    const response = await api.get<Maintenance[]>('/maintenance', { params });
    return response.data;
  },

  /**
   * Criar registro de manutenção
   */
  async create(data: MaintenanceCreateRequest): Promise<Maintenance> {
    const response = await api.post<Maintenance>('/maintenance', data);
    return response.data;
  },

  /**
   * Obter detalhes de uma manutenção
   */
  async get(id: string): Promise<Maintenance> {
    const response = await api.get<Maintenance>(`/maintenance/${id}`);
    return response.data;
  },

  /**
   * Atualizar manutenção
   */
  async update(id: string, data: Partial<MaintenanceCreateRequest>): Promise<Maintenance> {
    const response = await api.put<Maintenance>(`/maintenance/${id}`, data);
    return response.data;
  },

  /**
   * Deletar manutenção
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/maintenance/${id}`);
  },

  /**
   * Calcular estatísticas de manutenção
   */
  async getStats(vehicleId: string, dateStart?: string, dateEnd?: string) {
    const maintenances = await this.list({
      vehicleId,
      dateStart,
      dateEnd,
    });

    if (maintenances.length === 0) {
      return {
        totalCost: 0,
        count: 0,
        byType: {},
      };
    }

    const totalCost = maintenances.reduce((sum, m) => sum + (m.cost || 0), 0);

    // Agrupar por tipo
    const byType: Record<string, number> = {};
    maintenances.forEach((m) => {
      byType[m.type] = (byType[m.type] || 0) + 1;
    });

    return {
      totalCost,
      count: maintenances.length,
      byType,
    };
  },

  /**
   * Obter próximas manutenções previstas
   */
  async getUpcoming(vehicleId: string): Promise<Maintenance[]> {
    const maintenances = await this.list({ vehicleId });

    // Filtrar manutenções que têm próxima data ou quilometragem prevista
    return maintenances.filter(
      (m) => m.next_due_date || m.next_due_odometer
    );
  },
};
