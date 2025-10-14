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
  Camera,
  ChevronLeft,
  ChevronsUpDown,
  Zap,
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

interface Vehicle {
  brand: string;
  name: string;
  model: string;
  plate: string;
  year: string;
  color: string;
}

interface ActivityType {
  id: string;
  icon: any;
  label: string;
  description: string;
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCenter}
            onPress={() => setShowVehicleSelector(!showVehicleSelector)}
          >
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Nova Atualização</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {selectedVehicleData?.brand} {selectedVehicleData?.name} {selectedVehicleData?.model} • {selectedVehicleData?.plate} • {selectedVehicleData?.year}
              </Text>
            </View>

            <ChevronsUpDown size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
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
        <View style={styles.activitiesGrid}>
          {activityTypes.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => handleActivityPress(activity.id)}
              >
                <View style={styles.activityIconContainer}>
                  <IconComponent size={24} color={Colors.text.secondary} />
                </View>
                <Text style={styles.activityLabel}>{activity.label}</Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Captura Rápida - Footer Fixo */}
      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.quickCaptureButton}
            onPress={handleQuickCapture}
          >
            <View style={styles.quickCaptureIconContainer}>
              <Zap size={24} color={Colors.text.primary} />
            </View>
            <View style={styles.quickCaptureTextContainer}>
              <View style={styles.quickCaptureTitleRow}>
                <Text style={styles.quickCaptureTitle}>Captura Automática</Text>
                <View style={styles.iaBadge}>
                  <Text style={styles.iaBadgeText}>IA</Text>
                </View>
              </View>
              <Text style={styles.quickCaptureDescription}>
                Tire uma foto e deixe a IA identificar os dados
              </Text>
              <Text style={styles.quickCaptureCredits}>2 grátis</Text>
            </View>
            <Camera size={20} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
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
    padding: 16,
    paddingBottom: 32,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    width: '48%',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  activityIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footer: {
    backgroundColor: Colors.text.primary,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  quickCaptureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  quickCaptureIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCaptureTextContainer: {
    flex: 1,
  },
  quickCaptureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  quickCaptureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  iaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
  },
  iaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  quickCaptureDescription: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 2,
  },
  quickCaptureCredits: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
