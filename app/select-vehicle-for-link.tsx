import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Plus, Search, Car } from 'lucide-react-native';
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
import { SearchInput, BackButton } from '../components/ui';
import { useVehicles } from '@/hooks/vehicle';

export default function SelectVehicleForLinkScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { vehicles: vehiclesData, loading, error } = useVehicles();

  const [searchTerm, setSearchTerm] = useState('');

  // Transform API data to display format
  const vehicles = useMemo(() => {
    return vehiclesData.map((vehicle) => {
      const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0];
      const activeColor = vehicle.colors?.find(c => c.active) || vehicle.colors?.[0];
      const primaryCover = vehicle.covers?.find(cover => cover.is_primary) || vehicle.covers?.[0];

      return {
        id: vehicle.id,
        brand: vehicle.brands.brand,
        name: vehicle.models.model,
        model: vehicle.model_versions?.version || '',
        plate: activePlate?.plate || 'Sem placa',
        color: activeColor?.color || 'Sem cor',
        year: vehicle.model_year,
        imageUrl: primaryCover?.image_url || vehicle.primary_cover_url,
      };
    });
  }, [vehiclesData]);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to add-link flow with selected vehicle
  const handleVehicleSelect = (vehicleId: string) => {
    router.push({
      pathname: '/add-link/select-action',
      params: { vehicleId },
    });
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
        <BackButton />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Selecionar Veículo</Text>
          <Text style={styles.headerSubtitle}>Escolha um veículo para criar novo vínculo</Text>
        </View>
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
            /* No Search Results State */
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Search size={40} color={Colors.text.placeholder} />
              </View>
              <Text style={styles.emptyStateTitle}>Nenhum veículo encontrado</Text>
              <Text style={styles.emptyStateSubtitle}>
                Tente buscar com outros termos ou adicione um novo veículo.
              </Text>
            </View>
          ) : filteredVehicles.length === 0 ? (
            /* Empty State - No Vehicles */
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Car size={40} color={Colors.text.placeholder} />
              </View>
              <Text style={styles.emptyStateTitle}>Nenhum veículo cadastrado</Text>
              <Text style={styles.emptyStateSubtitle}>
                Adicione um veículo para criar um novo vínculo.
              </Text>
            </View>
          ) : (
            /* Vehicle List */
            <View style={styles.vehiclesList}>
              {filteredVehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={styles.vehicleCard}
                  activeOpacity={0.7}
                  onPress={() => handleVehicleSelect(vehicle.id)}
                >
                  <View style={styles.vehicleCardLeft}>
                    {vehicle.imageUrl ? (
                      <View style={styles.vehicleImageContainer}>
                        {/* Placeholder for vehicle image */}
                        <Car size={24} color={Colors.text.secondary} />
                      </View>
                    ) : (
                      <View style={styles.vehicleImageContainer}>
                        <Car size={24} color={Colors.text.secondary} />
                      </View>
                    )}
                    <View style={styles.vehicleInfo}>
                      <Text style={styles.vehicleName}>
                        {vehicle.brand} {vehicle.name} {vehicle.model}
                      </Text>
                      <View style={styles.vehicleDetails}>
                        <Text style={styles.vehicleDetailText}>{vehicle.plate}</Text>
                        <Text style={styles.vehicleDetailSeparator}>•</Text>
                        <Text style={styles.vehicleDetailText}>{vehicle.year}</Text>
                        <Text style={styles.vehicleDetailSeparator}>•</Text>
                        <Text style={styles.vehicleDetailText}>{vehicle.color}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Add Vehicle Button */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.7}
            onPress={() => router.push({
              pathname: '/add-vehicle',
              params: { from: 'select-vehicle-for-link' }
            })}
          >
            <View style={styles.addButtonIcon}>
              <Plus size={24} color={Colors.background.primary} />
            </View>
            <View style={styles.addButtonTextContainer}>
              <Text style={styles.addButtonTitle}>Adicionar Veículo</Text>
              <Text style={styles.addButtonSubtitle}>Cadastre um novo veículo</Text>
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
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 2,
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
  vehiclesList: {
    gap: 12,
    marginBottom: 24,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  vehicleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleDetailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  vehicleDetailSeparator: {
    fontSize: 14,
    color: Colors.text.tertiary,
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
