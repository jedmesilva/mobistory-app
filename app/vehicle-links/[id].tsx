import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { UserPlus, ArrowLeft } from 'lucide-react-native';
import { LinkSection, LinkedPerson } from '../../components/vehicle-details';
import { VehicleHeader } from '@/components/ui';
import { useSelectedVehicle } from '@/contexts';
import { useVehicle } from '@/hooks/vehicle';

export default function VehicleLinksScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Get selected vehicle from context or params
  const { selectedVehicleId: contextVehicleId, setSelectedVehicleId } = useSelectedVehicle();
  const paramsId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Update context once if navigated from params
  React.useEffect(() => {
    if (paramsId && paramsId !== contextVehicleId) {
      setSelectedVehicleId(paramsId);
    }
  }, [paramsId]);

  // Always use context as source of truth
  const vehicleId = contextVehicleId;

  // Fetch vehicle data
  const { vehicle: vehicleData } = useVehicle(vehicleId || undefined);

  // Transform vehicle data for display
  const vehicle = useMemo(() => {
    if (!vehicleData || !vehicleData.models || !vehicleData.brands) {
      return {
        id: '',
        brand: '',
        name: '',
        model: '',
        plate: '',
        color: '',
        year: 0,
      };
    }

    const activePlate = vehicleData.plates?.find(p => p.active) || vehicleData.plates?.[0];
    const activeColor = vehicleData.colors?.find(c => c.active) || vehicleData.colors?.[0];

    return {
      id: vehicleData.id,
      brand: vehicleData.brands?.brand || '',
      name: vehicleData.models?.model || '',
      model: vehicleData.model_versions?.version || '',
      plate: activePlate?.plate || '',
      color: activeColor?.color || '',
      year: vehicleData.model_year || 0,
    };
  }, [vehicleData]);

  const [linkedPeople] = useState<LinkedPerson[]>([
    {
      id: 1,
      name: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      avatar: null,
      relationshipType: 'owner',
      status: 'active',
      linkedDate: '15 Jan 2023',
      lastAccess: '19 Set 2025',
    },
    {
      id: 2,
      name: 'João Carlos Oliveira',
      email: 'joao.carlos@email.com',
      avatar: null,
      relationshipType: 'authorized_driver',
      status: 'active',
      linkedDate: '10 Mar 2024',
      lastAccess: '18 Set 2025',
    },
    {
      id: 3,
      name: 'Ana Paula Costa',
      email: 'ana.costa@email.com',
      avatar: null,
      relationshipType: 'renter',
      status: 'active',
      linkedDate: '05 Set 2025',
      lastAccess: '20 Set 2025',
    },
    {
      id: 4,
      name: 'Pedro Henrique Lima',
      email: 'pedro.lima@email.com',
      avatar: null,
      relationshipType: 'authorized_driver',
      status: 'former',
      linkedDate: '20 Jun 2023',
      lastAccess: '15 Fev 2024',
    },
    {
      id: 5,
      name: 'Carla Fernandes',
      email: 'carla.fernandes@email.com',
      avatar: null,
      relationshipType: 'renter',
      status: 'former',
      linkedDate: '10 Dez 2023',
      lastAccess: '28 Abr 2024',
    },
  ]);

  const [selectedPerson, setSelectedPerson] = useState<LinkedPerson | null>(null);
  const [showHistoryFor, setShowHistoryFor] = useState<{ [key: string]: boolean }>({});

  const owners = linkedPeople.filter((p) => p.relationshipType === 'owner' && p.status === 'active');
  const formerOwners = linkedPeople.filter((p) => p.relationshipType === 'owner' && p.status === 'former');
  const renters = linkedPeople.filter((p) => p.relationshipType === 'renter' && p.status === 'active');
  const formerRenters = linkedPeople.filter((p) => p.relationshipType === 'renter' && p.status === 'former');
  const authorizedDrivers = linkedPeople.filter((p) => p.relationshipType === 'authorized_driver' && p.status === 'active');
  const formerAuthorizedDrivers = linkedPeople.filter((p) => p.relationshipType === 'authorized_driver' && p.status === 'former');

  const toggleHistory = (type: string) => {
    setShowHistoryFor((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const totalActiveLinks = owners.length + renters.length + authorizedDrivers.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <VehicleHeader
        vehicleName={`${vehicle.brand} ${vehicle.name} ${vehicle.model}`}
        vehicleDetails={`${vehicle.plate} • ${vehicle.year} • ${vehicle.color}`}
        showChevron={false}
        showVehicleIcon={false}
        leftButton={
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de Vínculos */}
        <View style={styles.linksHeader}>
          <View style={styles.linksHeaderLeft}>
            <Text style={styles.linksTitle}>Vínculos</Text>
            <Text style={styles.linksCount}>{totalActiveLinks}</Text>
          </View>
          <TouchableOpacity
            style={styles.newLinkButton}
            onPress={() => router.push({
              pathname: '/add-link/select-action',
              params: { vehicleId: vehicle.id }
            })}
          >
            <UserPlus size={16} color={Colors.background.primary} />
            <Text style={styles.newLinkButtonText}>Novo vínculo</Text>
          </TouchableOpacity>
        </View>

        {/* Proprietários */}
        {(owners.length > 0 || formerOwners.length > 0) && (
          <LinkSection
            title="Proprietários"
            count={owners.length}
            people={owners}
            formerPeople={formerOwners}
            showHistory={showHistoryFor.owner || false}
            onToggleHistory={() => toggleHistory('owner')}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}

        {/* Locatários */}
        {(renters.length > 0 || formerRenters.length > 0) && (
          <LinkSection
            title="Locatários"
            count={renters.length}
            people={renters}
            formerPeople={formerRenters}
            showHistory={showHistoryFor.renter || false}
            onToggleHistory={() => toggleHistory('renter')}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}

        {/* Condutores */}
        {(authorizedDrivers.length > 0 || formerAuthorizedDrivers.length > 0) && (
          <LinkSection
            title="Condutores"
            count={authorizedDrivers.length}
            people={authorizedDrivers}
            formerPeople={formerAuthorizedDrivers}
            showHistory={showHistoryFor.authorized_driver || false}
            onToggleHistory={() => toggleHistory('authorized_driver')}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  linksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linksHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  linksCount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  newLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary.DEFAULT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  newLinkButtonText: {
    color: Colors.background.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
