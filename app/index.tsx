import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, Menu, Plus, Search } from 'lucide-react-native';
import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { VehicleCard, SectionHeader } from '../components/vehicle';
import { SearchInput } from '../components/ui';
import { MenuModal } from '../components/ui/MenuModal';

export default function Index() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [vehicles] = useState([
    {
      id: 1,
      name: 'Honda Civic',
      model: 'XLI',
      plate: 'ABC-1234',
      color: 'Prata',
      year: 2018,
      relationshipType: 'owner',
      status: 'active',
      relationshipStart: '12 Jan 2018',
      lastEvent: '19 Set 2025'
    },
    {
      id: 2,
      name: 'Toyota Corolla',
      model: 'GLI',
      plate: 'DEF-5678',
      color: 'Branco',
      year: 2020,
      relationshipType: 'owner',
      status: 'active',
      relationshipStart: '05 Mar 2020',
      lastEvent: '15 Set 2025'
    },
    {
      id: 3,
      name: 'Volkswagen Gol',
      model: 'G4',
      plate: 'GHI-9012',
      color: 'Azul',
      year: 2015,
      relationshipType: 'renter',
      status: 'active',
      relationshipStart: '01 Ago 2024',
      lastEvent: '10 Set 2025'
    },
    {
      id: 4,
      name: 'Ford Ka',
      model: 'SE Plus',
      plate: 'JKL-3456',
      color: 'Vermelho',
      year: 2019,
      relationshipType: 'authorized_driver',
      status: 'active',
      relationshipStart: '15 Mai 2023',
      lastEvent: '22 Set 2025'
    },
    {
      id: 5,
      name: 'Fiat Uno',
      model: 'Mille',
      plate: 'PQR-1122',
      color: 'Branco',
      year: 2014,
      relationshipType: 'owner',
      status: 'former',
      relationshipStart: '10 Fev 2014',
      lastEvent: '12 Jun 2025'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showHistoryFor, setShowHistoryFor] = useState<{[key: string]: boolean}>({});
  const [menuVisible, setMenuVisible] = useState(false);

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

  // Função para navegar para a tela de histórico
  const navigateToVehicleHistory = (vehicle: any) => {
    router.push({
      pathname: '/vehicle-history/[id]',
      params: {
        id: vehicle.id,
        name: vehicle.name,
        model: vehicle.model,
        plate: vehicle.plate,
        year: vehicle.year,
        color: vehicle.color
      }
    });
  };

  // Função para lidar com navegação do menu
  const handleMenuNavigation = (screen: string) => {
    // TODO: Implementar navegação para as telas do menu
    console.log('Navigate to:', screen);
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
          style={styles.headerButton}
          onPress={() => setMenuVisible(true)}
        >
          <Menu size={24} color={Colors.primary.light} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meus Vínculos</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/notifications')}
        >
          <Bell size={24} color={Colors.primary.light} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
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
          {filteredVehicles.length === 0 && searchTerm ? (
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
                      navigateToVehicleHistory={navigateToVehicleHistory}
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
                          navigateToVehicleHistory={navigateToVehicleHistory}
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
                      navigateToVehicleHistory={navigateToVehicleHistory}
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
                      navigateToVehicleHistory={navigateToVehicleHistory}
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

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleMenuNavigation}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background.primary,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error.DEFAULT,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: 'bold',
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
});