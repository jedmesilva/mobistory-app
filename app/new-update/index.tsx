import React, { useState } from 'react';
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
import {
  Car,
  ArrowLeft,
  Fuel,
  Gauge,
  Wrench,
  Settings,
  FileText,
  ShieldCheck,
  Sparkles,
  Droplet,
} from 'lucide-react-native';
import { Colors } from '@/constants';
import { VehicleHeader } from '@/components/ui';
import { ActivitiesGrid, QuickCaptureFooter, type ActivityType } from '@/components/new-update';

interface Vehicle {
  brand: string;
  name: string;
  model: string;
  plate: string;
  year: string;
  color: string;
}

export default function NewUpdateScreen() {
  const router = useRouter();
  const [selectedVehicleId, setSelectedVehicleId] = useState('1');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  const vehicles: Vehicle[] = [
    { brand: 'Honda', name: 'Civic', model: 'XLI', plate: 'ABC-1234', year: '2020', color: 'Prata' },
    { brand: 'Toyota', name: 'Corolla', model: 'XEI', plate: 'XYZ-5678', year: '2019', color: 'Preto' },
    { brand: 'Ford', name: 'Ka', model: 'SE', plate: 'DEF-9012', year: '2021', color: 'Branco' },
  ];

  const activityTypes: ActivityType[] = [
    {
      id: 'fuel',
      icon: Fuel,
      label: 'Abastecimento',
      description: 'Registre um novo abastecimento',
    },
    {
      id: 'tire',
      icon: Gauge,
      label: 'Calibragem',
      description: 'Calibração dos pneus',
    },
    {
      id: 'oil',
      icon: Droplet,
      label: 'Troca de óleo',
      description: 'Manutenção do motor',
    },
    {
      id: 'maintenance',
      icon: Wrench,
      label: 'Manutenção',
      description: 'Serviços gerais',
    },
    {
      id: 'inspection',
      icon: ShieldCheck,
      label: 'Inspeção',
      description: 'Vistoria do veículo',
    },
    {
      id: 'parts',
      icon: Settings,
      label: 'Troca de peças',
      description: 'Substituição de componentes',
    },
    {
      id: 'document',
      icon: FileText,
      label: 'Documentação',
      description: 'Licenciamento e multas',
    },
    {
      id: 'wash',
      icon: Sparkles,
      label: 'Lavagem',
      description: 'Limpeza do veículo',
    },
  ];

  const selectedVehicleData = vehicles[parseInt(selectedVehicleId) - 1];

  const handleActivityPress = (activityId: string) => {
    console.log('Selected activity:', activityId);
    // Aqui você pode navegar para a tela específica de cada tipo de atividade
  };

  const handleQuickCapture = () => {
    console.log('Captura Automática');
    // Aqui você pode abrir o SmartCaptureModal
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <SafeAreaView edges={['top']}>
        <VehicleHeader
          vehicleName={selectedVehicleData ? `${selectedVehicleData.brand} ${selectedVehicleData.name} ${selectedVehicleData.model}` : 'Selecione um veículo'}
          vehicleDetails={selectedVehicleData ? `${selectedVehicleData.plate} • ${selectedVehicleData.year} • ${selectedVehicleData.color}` : ''}
          onVehiclePress={() => setShowVehicleSelector(!showVehicleSelector)}
          showChevron={true}
          showVehicleIcon={true}
          leftButton={
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          }
        />
      </SafeAreaView>

      {/* Vehicle Selector Overlay */}
      {showVehicleSelector && (
        <View style={styles.vehicleSelectorOverlay}>
          <View style={styles.vehicleSelectorHeader}>
            <Text style={styles.vehicleSelectorTitle}>Seus Veículos</Text>
            <Text style={styles.vehicleSelectorSubtitle}>
              Selecione um veículo para atualização
            </Text>
          </View>

          <View style={styles.vehiclesList}>
            {vehicles.map((vehicle, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.vehicleItem,
                  selectedVehicleId === String(idx + 1) && styles.vehicleItemSelected,
                ]}
                onPress={() => {
                  setSelectedVehicleId(String(idx + 1));
                  setShowVehicleSelector(false);
                }}
              >
                <View style={styles.vehicleIconContainer}>
                  <Car size={20} color={Colors.background.primary} />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.name} {vehicle.model}</Text>
                  <Text style={styles.vehicleDetails}>
                    {vehicle.plate} • {vehicle.color}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ActivitiesGrid
          activities={activityTypes}
          onActivityPress={handleActivityPress}
        />
      </ScrollView>

      {/* Footer de Captura Rápida */}
      <QuickCaptureFooter onPress={handleQuickCapture} creditsRemaining={2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleSelectorOverlay: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  vehicleSelectorHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.secondary,
  },
  vehicleSelectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleSelectorSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  vehiclesList: {
    padding: 16,
    gap: 12,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.primary,
  },
  vehicleItemSelected: {
    borderColor: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.text.primary,
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
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },
});
