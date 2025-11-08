import { vehiclesService } from '@/lib/api/services/vehicles';
import { useEffect, useState } from 'react';

export interface LinkedPerson {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  relationshipType: 'owner' | 'renter' | 'authorized_driver';
  status: 'active' | 'former';
  linkedDate: string;
  lastAccess: string;
}

export interface VehicleLinks {
  activePeople: LinkedPerson[];
  formerPeople: LinkedPerson[];
}

// Hook para buscar vínculos de um veículo específico
export function useVehicleLinks(vehicleId: string | undefined) {
  const [links, setLinks] = useState<VehicleLinks>({ activePeople: [], formerPeople: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleLinks();
    }
  }, [vehicleId]);

  async function fetchVehicleLinks() {
    if (!vehicleId) return;

    try {
      setLoading(true);
      setError(null);
      
      const rawLinks = await vehiclesService.getVehicleLinks(vehicleId);
      
      // Transform API data to LinkedPerson format
      const transformedLinks = rawLinks.map((link: any) => ({
        id: parseInt(link.id),
        name: link.entity.name,
        email: link.entity.email || '',
        avatar: null,
        relationshipType: link.relationship_type as 'owner' | 'renter' | 'authorized_driver',
        status: link.status === 'terminated' ? 'former' : 'active' as 'active' | 'former',
        linkedDate: new Date(link.start_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        lastAccess: new Date(link.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      }));

      // Separate active and former people
      const activePeople = transformedLinks.filter((person: LinkedPerson) => person.status === 'active');
      const formerPeople = transformedLinks.filter((person: LinkedPerson) => person.status === 'former');
      
      setLinks({ activePeople, formerPeople });
      console.log('✅ Vehicle links loaded from API:', vehicleId);
    } catch (err) {
      setError(err as Error);
      console.error('❌ Error fetching vehicle links:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refetch() {
    await fetchVehicleLinks();
  }

  return {
    links,
    loading,
    error,
    refetch,
  };
}