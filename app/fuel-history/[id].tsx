import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Filter,
  Fuel,
  Activity,
} from 'lucide-react-native';
import {
  VehicleStatusCard,
  MonthlyStatsCard,
  FuelingCard,
} from '../../components/fuel-history';
import { SearchInput } from '../../components/ui';

interface FuelItem {
  type: string;
  liters: number;
  pricePerLiter: number;
  totalPrice: number;
}

interface Station {
  name: string;
  brand: string;
  address: string;
}

interface Fueling {
  id: number;
  date: string;
  time: string;
  station: Station;
  odometer: number;
  fuels: FuelItem[];
  totalLiters: number;
  totalValue: number;
  efficiency: number;
  kmTraveled: number;
  status: string;
}

export default function FuelHistoryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dados do veículo atual
  const currentVehicle = {
    name: 'Honda Civic',
    year: '2020',
    plate: 'ABC-1234',
    odometer: 89450,
    fuelLevel: 60,
    autonomy: 320,
    avgConsumption: 12.5,
  };

  // Dados dos abastecimentos
  const fuelingHistory: Fueling[] = [
    {
      id: 1,
      date: '2025-09-19',
      time: '14:30',
      station: {
        name: 'Shell Select',
        brand: 'Shell',
        address: 'Av. Paulista, 1500 - Bela Vista',
      },
      odometer: 89450,
      fuels: [
        {
          type: 'Gasolina Comum',
          liters: 42.5,
          pricePerLiter: 5.49,
          totalPrice: 233.32,
        },
      ],
      totalLiters: 42.5,
      totalValue: 233.32,
      efficiency: 12.7,
      kmTraveled: 540,
      status: 'completed',
    },
    {
      id: 2,
      date: '2025-09-10',
      time: '08:15',
      station: {
        name: 'Petrobras Centro',
        brand: 'Petrobras',
        address: 'R. Augusta, 800 - Consolação',
      },
      odometer: 88910,
      fuels: [
        {
          type: 'Gasolina Comum',
          liters: 38.5,
          pricePerLiter: 5.42,
          totalPrice: 208.67,
        },
      ],
      totalLiters: 38.5,
      totalValue: 208.67,
      efficiency: 13.1,
      kmTraveled: 505,
      status: 'completed',
    },
    {
      id: 3,
      date: '2025-09-01',
      time: '16:45',
      station: {
        name: 'Ipiranga Express',
        brand: 'Ipiranga',
        address: 'Av. Rebouças, 1200 - Pinheiros',
      },
      odometer: 88405,
      fuels: [
        {
          type: 'Gasolina Comum',
          liters: 35.0,
          pricePerLiter: 5.38,
          totalPrice: 188.3,
        },
        {
          type: 'Etanol',
          liters: 8.0,
          pricePerLiter: 3.89,
          totalPrice: 31.12,
        },
      ],
      totalLiters: 43.0,
      totalValue: 219.42,
      efficiency: 12.2,
      kmTraveled: 525,
      status: 'completed',
    },
  ];

  // Estatísticas resumidas
  const monthlyStats = {
    totalSpent: 1066.55,
    totalLiters: 208.7,
    avgPrice: 5.11,
    avgConsumption: 12.4,
    totalKm: 2594,
    abastecimentos: 5,
  };

  // Comparações com mês anterior
  const comparisons = {
    spending: { value: 1066.55, change: 8.5, trend: 'up' as const },
    consumption: { value: 12.4, change: -0.3, trend: 'down' as const },
    volume: { value: 208.7, change: 5.2, trend: 'up' as const },
    price: { value: 5.11, change: 0.12, trend: 'up' as const },
  };

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getFuelTypeStyle = (type: string) => {
    const styles = {
      'Gasolina Comum': { bg: '#fee2e2', text: '#991b1b' },
      'Gasolina Aditivada': { bg: '#fee2e2', text: '#991b1b' },
      'Etanol': { bg: '#dcfce7', text: '#166534' },
      'Diesel': { bg: '#fef3c7', text: '#854d0e' },
      'GNV': { bg: '#dbeafe', text: '#1e40af' },
    };
    return styles[type as keyof typeof styles] || { bg: '#f3f4f6', text: '#1f2937' };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color="#4b5563" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Abastecimentos</Text>
          <Text style={styles.headerSubtitle}>
            {currentVehicle.name} • {currentVehicle.plate}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={styles.headerButton}
        >
          <Filter size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Status do Veículo */}
          <VehicleStatusCard
            odometer={currentVehicle.odometer}
            fuelLevel={currentVehicle.fuelLevel}
            autonomy={currentVehicle.autonomy}
          />

          {/* Estatísticas do Mês */}
          <MonthlyStatsCard
            monthName="Setembro 2025"
            monthlyStats={monthlyStats}
            comparisons={comparisons}
            formatCurrency={formatCurrency}
          />

          {/* Lista de Abastecimentos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Histórico</Text>
              <Text style={styles.sectionSubtitle}>{fuelingHistory.length} registros</Text>
            </View>

            {/* Busca */}
            <View style={styles.searchContainer}>
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por posto, data ou valor..."
              />
            </View>

            <View style={styles.fuelingList}>
              {fuelingHistory.map((fueling, index) => (
                <View key={fueling.id}>
                  <FuelingCard
                    fueling={fueling}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                    getFuelTypeStyle={getFuelTypeStyle}
                  />

                  {/* Indicador de distância */}
                  {fueling.kmTraveled && (
                    <View style={styles.distanceBanner}>
                      <Activity size={12} color="#4b5563" />
                      <Text style={styles.distanceText}>
                        {fueling.kmTraveled} km desde o último abastecimento
                        {index < fuelingHistory.length - 1 &&
                          ` • ${((fueling.kmTraveled / fueling.totalLiters) || 0).toFixed(
                            1
                          )} km/L`}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão Flutuante */}
      <SafeAreaView style={styles.fabContainer} edges={['bottom']}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-fueling/station-selection')}
        >
          <Fuel size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  fuelingList: {
    gap: 12,
  },
  distanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -4,
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 12,
    color: '#4b5563',
  },
  searchContainer: {
    marginBottom: 16,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    right: 24,
  },
  fab: {
    width: 64,
    height: 64,
    marginBottom: 24,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
