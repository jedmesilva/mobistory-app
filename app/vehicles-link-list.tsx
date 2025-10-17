import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Plus, Search } from 'lucide-react-native';
import React, { useRef, useState, useMemo } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchInput } from '../components/ui';
import { SectionHeader, VehicleCard } from '../components/vehicle';
import { useVehiclesWithLinks } from '@/hooks/vehicle';

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { vehicles: vehiclesData, loading, error } = useVehiclesWithLinks();

  const [searchTerm, setSearchTerm] = useState('');
  const [showHistoryFor, setShowHistoryFor] = useState<{[key: string]: boolean}>({});

  // Transform Supabase data to match the expected format
  const vehicles = useMemo(() => {
    // Create a flat list of vehicles with their links
    const vehicleLinks = vehiclesData.flatMap((vehicle) => {
      const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0]
      const activeColor = vehicle.colors?.find(c => c.active) || vehicle.colors?.[0]

      // Get all active links for this vehicle
      const activeLinks = vehicle.vehicle_entity_links?.filter(link => link.active) || []

      // If no links, still show the vehicle (for backwards compatibility)
      if (activeLinks.length === 0) {
        return [{
          id: vehicle.id,
          brand: vehicle.brands.brand,
          name: vehicle.models.model,
          model: vehicle.model_versions?.version || '',
          plate: activePlate?.plate || 'Sem placa',
          color: activeColor?.color || 'Sem cor',
          year: vehicle.model_year,
          relationshipType: 'owner',
          status: 'active',
          relationshipStart: new Date(vehicle.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          lastEvent: new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        }]
      }

      // Map each link to a vehicle entry
      return activeLinks.map((link) => ({
        id: vehicle.id,
        brand: vehicle.brands.brand,
        name: vehicle.models.model,
        model: vehicle.model_versions?.version || '',
        plate: activePlate?.plate || 'Sem placa',
        color: activeColor?.color || 'Sem cor',
        year: vehicle.model_year,
        relationshipType: link.relationship_type,
        status: link.end_date && new Date(link.end_date) < new Date() ? 'former' : link.status,
        relationshipStart: new Date(link.start_date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        lastEvent: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }))
    });

    return vehicleLinks;
  }, [vehiclesData]);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ownedVehicles = filteredVehicles.filter(v => v.relationshipType === 'owner' && v.status === 'active');
  const formerOwnedVehicles = filteredVehicles.filter(v => v.relationshipType === 'owner' && v.status === 'former');
  const rentedVehicles = filteredVehicles.filter(v => v.relationshipType === 'renter' && v.status === 'active');
  const authorizedDriverVehicles = filteredVehicles.filter(v => v.relationshipType === 'authorized_driver' && v.status === 'active');

  const relationshipConfig: {[key: string]: any} = {
    owner: { label: 'Proprietário' },
    renter: { label: 'Locatário' },
    authorized_driver: { label: 'Condutor' }
  };

  const toggleHistory = (relationshipType: string) => {
    setShowHistoryFor(prev => ({
      ...prev,
      [relationshipType]: !prev[relationshipType]
    }));
  };

  // Função para navegar de volta com o veículo selecionado
  const navigateToVehicleProfile = (vehicle: any) => {
    // Determina para onde navegar baseado no parâmetro 'from'
    const fromRoute = params.from || 'vehicle-profile';

    if (fromRoute === 'new-update') {
      // Volta para tela de nova atualização com o veículo selecionado
      router.push({
        pathname: '/new-update',
        params: {
          vehicleId: vehicle.id,
          brand: vehicle.brand,
          name: vehicle.name,
          model: vehicle.model,
          plate: vehicle.plate,
          color: vehicle.color,
          year: vehicle.year,
        }
      });
    } else if (fromRoute === 'vehicle-profile') {
      // Volta para tela de perfil do veículo com o veículo selecionado
      router.push({
        pathname: '/vehicle-profile',
        params: {
          vehicleId: vehicle.id,
          brand: vehicle.brand,
          name: vehicle.name,
          model: vehicle.model,
          plate: vehicle.plate,
          color: vehicle.color,
          year: vehicle.year,
        }
      });
    } else if (fromRoute === 'feed') {
      // Feed não precisa selecionar veículo, apenas volta
      router.back();
    }
  };

  const headerBorderWidth = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            borderBottomWidth: headerBorderWidth,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meus Vínculos</Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {/* Search */}
        <View style={styles.searchWrapper}>
          <SearchInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar veículo..."
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            /* Loading State */
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
              <Text style={styles.loadingText}>Carregando veículos...</Text>
            </View>
          ) : error ? (
            /* Error State */
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Search size={40} color={Colors.text.placeholder} />
              </View>
              <Text style={styles.emptyStateTitle}>Erro ao carregar veículos</Text>
              <Text style={styles.emptyStateSubtitle}>{error.message}</Text>
            </View>
          ) : filteredVehicles.length === 0 && searchTerm ? (
            /* Empty State */
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Search size={40} color={Colors.text.placeholder} />
              </View>
              <Text style={styles.emptyStateTitle}>Nenhum veículo encontrado</Text>
              <Text style={styles.emptyStateSubtitle}>
                Tente buscar com outros termos ou adicione um novo veículo.
              </Text>
            </View>
          ) : (
            <View>
              {/* Proprietário */}
              {ownedVehicles.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Proprietário"
                    count={ownedVehicles.length}
                    historicalCount={formerOwnedVehicles.length}
                    relationshipType="owner"
                    showHistoryFor={showHistoryFor}
                    toggleHistory={toggleHistory}
                  />
                  {ownedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      navigateToVehicleHistory={navigateToVehicleProfile}
                      relationshipConfig={relationshipConfig}
                    />
                  ))}
                  {showHistoryFor.owner && (
                    <>
                      <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Histórico</Text>
                        <View style={styles.dividerLine} />
                      </View>
                      {formerOwnedVehicles.map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          isHistorical={true}
                          navigateToVehicleHistory={navigateToVehicleProfile}
                          relationshipConfig={relationshipConfig}
                        />
                      ))}
                    </>
                  )}
                </View>
              )}

              {/* Locatário */}
              {rentedVehicles.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Locatário"
                    count={rentedVehicles.length}
                    historicalCount={0}
                    relationshipType="renter"
                    showHistoryFor={showHistoryFor}
                    toggleHistory={toggleHistory}
                  />
                  {rentedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      navigateToVehicleHistory={navigateToVehicleProfile}
                      relationshipConfig={relationshipConfig}
                    />
                  ))}
                </View>
              )}

              {/* Condutor */}
              {authorizedDriverVehicles.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Condutor"
                    count={authorizedDriverVehicles.length}
                    historicalCount={0}
                    relationshipType="authorized_driver"
                    showHistoryFor={showHistoryFor}
                    toggleHistory={toggleHistory}
                  />
                  {authorizedDriverVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      navigateToVehicleHistory={navigateToVehicleProfile}
                      relationshipConfig={relationshipConfig}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Add Vehicle Button */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.7}
            onPress={() => router.push('/add-vehicle')}
          >
            <View style={styles.addButtonIcon}>
              <Plus size={24} color={Colors.background.primary} />
            </View>
            <View style={styles.addButtonTextContainer}>
              <Text style={styles.addButtonTitle}>Adicionar Veículo</Text>
              <Text style={styles.addButtonSubtitle}>Registre um novo vínculo</Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </Animated.ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background.primary,
    borderBottomColor: Colors.border.DEFAULT,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  searchWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.DEFAULT,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginHorizontal: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background.primary,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border.dark,
    borderRadius: 16,
    gap: 16,
  },
  addButtonIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonTextContainer: {
    flex: 1,
  },
  addButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  addButtonSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.tertiary,
    marginTop: 16,
  },
});