import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import {
  Fuel,
  AlertTriangle,
  MessageCircle,
  Gauge,
  CheckCircle,
  UserCheck,
  Calendar,
  ArrowLeft,
  Wrench,
} from 'lucide-react-native';
import { OdometerIcon } from '../../components/icons';
import { ActivityCard } from '../../components/vehicle';
import { SmartCaptureModal } from '../../components/ui/SmartCaptureModal';
import { VehicleHeader } from '@/components/ui';
import { FeedFAB } from '../../components/feed';

interface ActivityDetail {
  label: string;
  value: string;
}

interface Activity {
  id: number;
  type: string;
  icon: any;
  title: string;
  description: string;
  time: string;
  linkType?: string;
  isActive?: boolean;
  details?: ActivityDetail[];
  status?: string;
}

interface DateGroup {
  date: string;
  activities: Activity[];
}

const HEADER_HEIGHT = 120;
const SCROLL_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.5; // Velocidade mínima para esconder (ajustável)

export default function VehicleHistoryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const vehicleBrand = Array.isArray(params.brand) ? params.brand[0] : (params.brand || 'Honda');
  const vehicleName = Array.isArray(params.name) ? params.name[0] : (params.name || 'Civic');
  const vehicleModel = Array.isArray(params.model) ? params.model[0] : (params.model || 'XLI');
  const vehiclePlate = Array.isArray(params.plate) ? params.plate[0] : (params.plate || 'ABC-1234');
  const vehicleColor = Array.isArray(params.color) ? params.color[0] : (params.color || 'Prata');
  const vehicleYear = Array.isArray(params.year) ? params.year[0] : (params.year || '2018');
  const vehicleId = Array.isArray(params.id) ? params.id[0] : (params.id || '1');

  const [selectedVehicle] = useState({
    id: vehicleId,
    brand: vehicleBrand,
    name: vehicleName,
    model: vehicleModel,
    plate: vehiclePlate,
    color: vehicleColor,
    year: vehicleYear,
    odometer: 45230,
    fuelType: 'Gasolina',
    status: 'active',
    lastEvent: '19 Set 2025',
  });

  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollViewRef = useRef<any>(null);
  const isInitialLoad = useRef(true);

  // Valores animados controlados manualmente
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  const timelineData = useMemo<DateGroup[]>(() => [
    {
      date: '01 Jan 2024',
      activities: [
        {
          id: 9,
          type: 'link',
          icon: UserCheck,
          title: 'Novo Vínculo Iniciado',
          description: 'João Pereira',
          time: '10:00',
          linkType: 'owner',
          isActive: true,
          details: [
            { label: 'Tipo de Vínculo', value: 'Proprietário' },
            { label: 'KM Inicial', value: '28.450 km' },
            { label: 'Atividades', value: '156 registros' },
            { label: 'KM Percorridos', value: '16.780 km' },
          ],
          status: 'active',
        },
      ],
    },
    {
      date: '10 Set 2025',
      activities: [
        {
          id: 7,
          type: 'link',
          icon: UserCheck,
          title: 'Novo Vínculo Iniciado',
          description: 'Carlos Silva',
          time: '15:30',
          linkType: 'conductor',
          isActive: true,
          details: [
            { label: 'Tipo de Vínculo', value: 'Condutor' },
            { label: 'KM Inicial', value: '43.850 km' },
            { label: 'Atividades', value: '12 registros' },
            { label: 'KM Percorridos', value: '1.380 km' },
          ],
          status: 'active',
        },
      ],
    },
    {
      date: '15 Set 2025',
      activities: [
        {
          id: 8,
          type: 'alert',
          icon: AlertTriangle,
          title: 'Alerta de Manutenção',
          description: 'Revisão programada próxima',
          time: '08:00',
          details: [
            { label: 'Tipo', value: 'Revisão 45.000 km' },
            { label: 'Prazo', value: 'Em 5 dias' },
          ],
          status: 'warning',
        },
      ],
    },
    {
      date: '20 Set 2025',
      activities: [
        {
          id: 5,
          type: 'maintenance',
          icon: Wrench,
          title: 'Troca de Óleo',
          description: 'Manutenção preventiva',
          time: '09:00',
          details: [
            { label: 'Tipo', value: 'Sintético 5W30' },
            { label: 'KM', value: '44.120 km' },
            { label: 'Próxima', value: '49.120 km' },
          ],
          status: 'completed',
        },
        {
          id: 6,
          type: 'maintenance',
          icon: CheckCircle,
          title: 'Filtro de Ar',
          description: 'Substituição realizada',
          time: '09:00',
          details: [{ label: 'Status', value: 'Concluído' }],
          status: 'completed',
        },
      ],
    },
    {
      date: '25 Set 2025',
      activities: [
        {
          id: 4,
          type: 'fuel',
          icon: Fuel,
          title: 'Abastecimento',
          description: 'Petrobras Centro',
          time: '18:40',
          details: [
            { label: 'Volume', value: '40,0 L' },
            { label: 'Valor', value: 'R$ 246,00' },
            { label: 'Preço/L', value: 'R$ 6,15' },
            { label: 'Consumo', value: '13,1 km/L' },
          ],
          status: 'completed',
        },
      ],
    },
    {
      date: '28 Set 2025',
      activities: [
        {
          id: 3,
          type: 'tire',
          icon: Gauge,
          title: 'Calibragem de Pneus',
          description: 'Calibragem completa realizada',
          time: '10:15',
          details: [
            { label: 'Dianteiro', value: '32 PSI' },
            { label: 'Traseiro', value: '30 PSI' },
            { label: 'Estepe', value: '35 PSI' },
          ],
          status: 'completed',
        },
      ],
    },
    {
      date: '30 Set 2025',
      activities: [
        {
          id: 1,
          type: 'km',
          icon: OdometerIcon,
          title: 'Atualização de Quilometragem',
          description: '45.230 km registrados',
          time: '14:30',
          details: [
            { label: 'KM Atual', value: '45.230 km' },
            { label: 'Desde último', value: '+540 km' },
          ],
          status: 'completed',
        },
        {
          id: 2,
          type: 'fuel',
          icon: Fuel,
          title: 'Abastecimento',
          description: 'Shell Centro',
          time: '14:25',
          details: [
            { label: 'Volume', value: '42,5 L' },
            { label: 'Valor', value: 'R$ 255,30' },
            { label: 'Preço/L', value: 'R$ 6,01' },
            { label: 'Consumo', value: '12,7 km/L' },
          ],
          status: 'completed',
        },
      ],
    },
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 300);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Função para mostrar todos os elementos
  const showAllElements = () => {
    Animated.parallel([
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  };

  // Função para esconder todos os elementos
  const hideAllElements = () => {
    const headerTranslate = headerHeight > 0 ? -headerHeight : -HEADER_HEIGHT;

    Animated.parallel([
      Animated.spring(headerTranslateY, {
        toValue: headerTranslate,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 0,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  };

  // Lógica baseada em velocidade E detecção de limites
  const handleScrollEndDrag = (event: any) => {
    if (isInitialLoad.current) return;

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const velocity = event.nativeEvent.velocity?.y || 0;

    // Detecta se chegou no TOPO (contentOffset.y ≈ 0)
    const isAtTop = contentOffset.y <= 10;

    // Detecta se chegou no FIM (contentOffset.y + altura visível ≈ altura total)
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;

    // Se chegou no topo OU no fim → SEMPRE MOSTRA
    if (isAtTop || isAtBottom) {
      showAllElements();
      return;
    }

    // Scroll rápido para BAIXO (velocity > threshold) → ESCONDE
    if (velocity > VELOCITY_THRESHOLD) {
      hideAllElements();
    }
    // Qualquer scroll para CIMA (velocity < 0) → MOSTRA
    else if (velocity < 0) {
      showAllElements();
    }
  };

  const handleCapture = useCallback((method: 'camera' | 'voice' | 'gallery') => {
    setShowCaptureModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      console.log(`Captura automática via ${method} concluída`);
      setIsProcessing(false);
    }, 2000);
  }, []);

  const handleVehiclePress = useCallback(() => {
    router.push(`/vehicle-details/${selectedVehicle.id}`);
  }, [router, selectedVehicle.id]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleChatPress = useCallback(() => {
    router.push({
      pathname: '/conversations/[id]',
      params: {
        id: selectedVehicle.id,
        name: selectedVehicle.name,
        plate: selectedVehicle.plate,
        year: selectedVehicle.year,
        color: selectedVehicle.color
      }
    });
  }, [router, selectedVehicle]);

  const handleNewUpdatePress = useCallback(() => {
    router.push('/new-update');
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.headerSafeArea,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      >
        <SafeAreaView edges={['top']}>
          <VehicleHeader
            vehicleName={`${selectedVehicle.brand} ${selectedVehicle.name} ${selectedVehicle.model}`}
            vehicleDetails={`${selectedVehicle.plate} • ${selectedVehicle.year} • ${selectedVehicle.color}`}
            onVehiclePress={handleVehiclePress}
            showChevron={false}
            showVehicleIcon={false}
            leftButton={
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            }
            rightButton={
              <TouchableOpacity
                style={styles.chatButton}
                onPress={handleChatPress}
              >
                <MessageCircle size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            }
          />
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleScrollEndDrag}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {isProcessing && (
          <View style={styles.processingBanner}>
            <View style={styles.processingContent}>
              <View style={styles.spinner} />
              <Text style={styles.processingText}>Processando captura automática...</Text>
            </View>
          </View>
        )}

        <View style={styles.timeline}>
          {timelineData.map((dateGroup, dateIdx) => (
            <View key={dateIdx} style={styles.dateGroup}>
              <View style={styles.dateHeader}>
                <View style={styles.dateBadge}>
                  <Calendar size={14} color={Colors.text.secondary} />
                  <Text style={styles.dateText}>{dateGroup.date}</Text>
                </View>
                <View style={styles.dateDivider} />
              </View>

              <View style={styles.activitiesContainer}>
                {dateGroup.activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </Animated.ScrollView>

      {/* Botão Flutuante */}
      <FeedFAB
        scale={fabScale}
        onPress={handleNewUpdatePress}
      />

      <SmartCaptureModal
        visible={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onCapture={handleCapture}
        title="Captura Rápida"
        subtitle="Selecione uma opção para registrar um novo evento"
        options={{
          camera: 'Fotografe os dados do evento',
          voice: 'Fale os dados do evento',
          gallery: 'Selecione uma foto com os dados',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
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
    paddingTop: 120,
    paddingBottom: 40,
  },
  processingBanner: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.info.light,
    marginBottom: 16,
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.info.DEFAULT,
    borderTopColor: 'transparent',
    borderRadius: 10,
  },
  processingText: {
    color: Colors.info.dark,
    fontSize: 14,
  },
  timeline: {
    gap: 32,
  },
  dateGroup: {
    marginBottom: 32,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.light,
  },
  dateDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.DEFAULT,
  },
  activitiesContainer: {
    gap: 16,
  },
});
