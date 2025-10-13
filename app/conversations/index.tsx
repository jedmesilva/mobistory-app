import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Car, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants';
import { SimpleHeader } from '@/components/ui';

interface Vehicle {
  id: number;
  name: string;
  model: string;
  plate: string;
  year: number;
  color: string;
}

export default function ConversationsScreen() {
  const router = useRouter();

  // Mock data - em produção virá da API
  const vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Honda Civic',
      model: 'XLI',
      plate: 'ABC-1234',
      year: 2018,
      color: 'Prata',
    },
    {
      id: 2,
      name: 'Toyota Corolla',
      model: 'GLI',
      plate: 'DEF-5678',
      year: 2020,
      color: 'Branco',
    },
    {
      id: 3,
      name: 'Volkswagen Gol',
      model: 'G4',
      plate: 'GHI-9012',
      year: 2015,
      color: 'Azul',
    },
    {
      id: 4,
      name: 'Ford Ka',
      model: 'SE Plus',
      plate: 'JKL-3456',
      year: 2019,
      color: 'Vermelho',
    },
  ];

  const handleVehiclePress = (vehicle: Vehicle) => {
    router.push({
      pathname: '/conversations/[id]',
      params: {
        id: vehicle.id,
        name: `${vehicle.name} ${vehicle.model}`,
        plate: vehicle.plate,
        year: vehicle.year,
        color: vehicle.color
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <SimpleHeader title="Conversas" />

      {/* Lista de Veículos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {vehicles.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Car size={48} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma conversa</Text>
            <Text style={styles.emptyStateSubtitle}>
              Você ainda não tem conversas com veículos
            </Text>
          </View>
        ) : (
          /* Lista de Veículos */
          <View style={styles.vehiclesList}>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => handleVehiclePress(vehicle)}
                activeOpacity={0.7}
              >
                <View style={styles.vehicleCardLeft}>
                  <View style={styles.vehicleIcon}>
                    <Car size={24} color={Colors.text.secondary} />
                  </View>

                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                      {vehicle.name} {vehicle.model}
                    </Text>
                    <Text style={styles.vehicleDetails}>
                      {vehicle.plate} • {vehicle.year} • {vehicle.color}
                    </Text>
                  </View>
                </View>

                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    backgroundColor: Colors.background.secondary,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  vehiclesList: {
    padding: 16,
    gap: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  vehicleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.secondary,
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
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
