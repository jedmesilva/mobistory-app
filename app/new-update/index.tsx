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
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { useSelectedVehicle } from '@/contexts';
import { useVehicle } from '@/hooks/vehicle';

export default function NewUpdateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get selected vehicle from context
  const { selectedVehicleId } = useSelectedVehicle();

  // Fetch vehicle data
  const { vehicle: vehicleData } = useVehicle(selectedVehicleId || undefined);

  // Transform vehicle data for display
  const selectedVehicleData = React.useMemo(() => {
    if (!vehicleData || !vehicleData.models || !vehicleData.brands) {
      return {
        brand: 'Selecione',
        name: 'um veículo',
        model: '',
        plate: '',
        year: '',
        color: '',
      };
    }

    const activePlate = vehicleData.plates?.find(p => p.active) || vehicleData.plates?.[0];
    const activeColor = vehicleData.colors?.find(c => c.active) || vehicleData.colors?.[0];

    return {
      brand: vehicleData.brands?.brand || '',
      name: vehicleData.models?.model || '',
      model: vehicleData.model_versions?.version || '',
      plate: activePlate?.plate || '',
      year: vehicleData.model_year?.toString() || '',
      color: activeColor?.color || '',
    };
  }, [vehicleData]);

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
          vehicleName={`${selectedVehicleData.brand} ${selectedVehicleData.name} ${selectedVehicleData.model}`}
          vehicleDetails={`${selectedVehicleData.plate} • ${selectedVehicleData.year} • ${selectedVehicleData.color}`}
          onVehiclePress={() => router.push({
            pathname: '/vehicles-link-list',
            params: { from: 'new-update' }
          })}
          showChevron={true}
          showVehicleIcon={false}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
  },
});
