import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Camera,
  ChevronRight,
  ChevronsUpDown,
  Fuel,
  Gauge,
  Wrench,
  Settings,
  FileText,
  ShieldCheck,
  Sparkles,
  Droplet,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';
import { useSelectedVehicle } from '@/contexts';
import { useVehicle } from '@/hooks/vehicle';

type ActivityType = {
  id: string;
  icon: any;
  label: string;
};

interface NewUpdateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NewUpdateModal({ visible, onClose }: NewUpdateModalProps) {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

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
    { id: 'fuel', icon: Fuel, label: 'Abastecimento' },
    { id: 'tire', icon: Gauge, label: 'Calibragem' },
    { id: 'oil', icon: Droplet, label: 'Troca de óleo' },
    { id: 'maintenance', icon: Wrench, label: 'Manutenção' },
    { id: 'inspection', icon: ShieldCheck, label: 'Inspeção' },
    { id: 'parts', icon: Settings, label: 'Peças' },
    { id: 'document', icon: FileText, label: 'Documentação' },
    { id: 'wash', icon: Sparkles, label: 'Lavagem' },
  ];

  const handleQuickCapture = () => {
    onClose();
    router.push('/quick-capture');
  };

  const handleActivityPress = (activityId: string) => {
    setSelectedActivity(activityId);

    // Fechar o modal primeiro
    onClose();

    // Navegar para a tela específica da atividade
    if (activityId === 'fuel') {
      router.push('/add-fueling');
    }
    // TODO: Adicionar navegação para outras atividades
  };

  const handleVehicleSelectorPress = () => {
    onClose();
    router.push({
      pathname: '/vehicles-link-list',
      params: { from: 'new-update' }
    });
  };

  const vehicleDisplayName = selectedVehicleData.model
    ? `${selectedVehicleData.brand} ${selectedVehicleData.name} ${selectedVehicleData.model}`
    : `${selectedVehicleData.brand} ${selectedVehicleData.name}`;

  const vehicleDetails = [
    selectedVehicleData.plate,
    selectedVehicleData.year,
  ].filter(Boolean).join(' • ');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.vehicleSelector}
              onPress={handleVehicleSelectorPress}
              activeOpacity={0.7}
            >
              <View style={styles.vehicleSelectorText}>
                <Text style={styles.headerTitle}>Nova Atualização</Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {vehicleDisplayName} • {vehicleDetails}
                </Text>
              </View>

              <ChevronsUpDown size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Destaque da Captura Rápida */}
          <TouchableOpacity
            style={styles.quickCaptureContainer}
            onPress={handleQuickCapture}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.quickCaptureGradient}
            >
              <View style={styles.quickCaptureIconContainer}>
                <Camera size={28} color="#1a1a1a" />
              </View>

              <View style={styles.quickCaptureTextContainer}>
                <View style={styles.quickCaptureTitleRow}>
                  <Text style={styles.quickCaptureTitle}>Captura Rápida</Text>
                  <LinearGradient
                    colors={['#3b82f6', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.aiBadge}
                  >
                    <Text style={styles.aiBadgeText}>com IA</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.quickCaptureDescription}>
                  Tire uma foto e deixe a IA extrair todos os dados
                </Text>
                <Text style={styles.quickCaptureCredits}>
                  2 capturas grátis disponíveis
                </Text>
              </View>

              <ChevronRight size={20} color="#d1d5db" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou registre manualmente</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Grid de Atividades - 3 colunas */}
          <View style={styles.activitiesGrid}>
            {activityTypes.map((activity) => {
              const IconComponent = activity.icon;
              const isSelected = selectedActivity === activity.id;

              return (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityCard,
                    isSelected && styles.activityCardSelected
                  ]}
                  onPress={() => handleActivityPress(activity.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityIconContainer}>
                    <IconComponent size={20} color={Colors.text.secondary} />
                  </View>
                  <Text style={styles.activityLabel} numberOfLines={2}>
                    {activity.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleSelector: {
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
  vehicleSelectorText: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  quickCaptureContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  quickCaptureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  quickCaptureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickCaptureTextContainer: {
    flex: 1,
  },
  quickCaptureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  quickCaptureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background.primary,
  },
  aiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.background.primary,
  },
  quickCaptureDescription: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
  quickCaptureCredits: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4ade80',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityCard: {
    width: (Dimensions.get('window').width - 32 - 24) / 3, // 32 (padding) + 24 (gaps)
    aspectRatio: 1,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.light,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activityCardSelected: {
    borderColor: Colors.text.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ scale: 1.02 }],
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
