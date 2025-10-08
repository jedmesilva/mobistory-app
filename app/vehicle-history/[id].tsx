import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Fuel,
  AlertTriangle,
  MessageCircle,
  Gauge,
  CheckCircle,
  UserCheck,
  Calendar,
  ArrowLeft,
  Wrench,
  Droplet,
} from 'lucide-react-native';
import { OdometerIcon, FuelTankIcon, OilIcon } from '../../components/icons';
import { ActivityCard } from '../../components/vehicle';
import { CaptureButton } from '../../components/ui/CaptureButton';
import { SmartCaptureModal } from '../../components/ui/SmartCaptureModal';
import { ChatScreen } from '../../components/chat';

// Tipos
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

export default function VehicleHistoryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [selectedVehicle] = useState({
    id: params.id || 1,
    name: params.name || 'Honda Civic',
    model: params.model || 'XLI',
    plate: params.plate || 'ABC-1234',
    color: params.color || 'Prata',
    year: params.year || 2018,
    odometer: 45230,
    fuelType: 'Gasolina',
    status: 'active',
    lastEvent: '19 Set 2025',
  });

  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const lastScrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollDistanceY = useRef(0);
  const isInitialLoad = useRef(true);

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

  // Scroll para o final ao carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
      // Após o scroll inicial, marca que pode processar scrolls normalmente
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 300);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Controle de scroll para esconder/mostrar header e footer
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Ignora scroll durante o carregamento inicial
    if (isInitialLoad.current) {
      return;
    }

    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    // Acumula a distância percorrida na direção atual
    if (scrollDiff > 0) {
      // Rolando PARA BAIXO (scroll positivo = indo para o FUNDO = mensagens recentes)
      // Deve MOSTRAR os elementos
      scrollDistanceY.current = Math.max(0, scrollDistanceY.current + scrollDiff);
    } else {
      // Rolando PARA CIMA (scroll negativo = voltando para o TOPO = mensagens antigas)
      // Deve ESCONDER os elementos
      scrollDistanceY.current = Math.min(0, scrollDistanceY.current + scrollDiff);
    }

    // MOSTRA se rolou 20px PARA BAIXO (em direção ao fundo)
    if (scrollDistanceY.current >= 20) {
      if (!isHeaderVisible || !isFooterVisible) {
        setIsHeaderVisible(true);
        setIsFooterVisible(true);
      }
      scrollDistanceY.current = 20; // Mantém no limite
    }

    // ESCONDE se rolou 120px PARA CIMA (em direção ao topo)
    if (scrollDistanceY.current <= -120) {
      if (isHeaderVisible || isFooterVisible) {
        setIsHeaderVisible(false);
        setIsFooterVisible(false);
      }
      scrollDistanceY.current = -120; // Mantém no limite
    }

    lastScrollY.current = currentScrollY;
  };

  const handleCapture = (method: 'camera' | 'voice' | 'gallery') => {
    setShowCaptureModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      console.log(`Captura automática via ${method} concluída`);
      setIsProcessing(false);
    }, 2000);
  };


  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      {isHeaderVisible && (
        <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronRight size={20} color="#4b5563" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerTitleContainer}
                onPress={() => router.push(`/vehicle-details/${selectedVehicle.id}`)}
              >
                <Text style={styles.headerTitle}>
                  {selectedVehicle.name} {selectedVehicle.model}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {selectedVehicle.plate} • {selectedVehicle.year} • {selectedVehicle.color}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.chatButton} onPress={() => setChatVisible(true)}>
              <MessageCircle size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
      )}

      {/* Conteúdo */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
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
                  <Calendar size={14} color="#4b5563" />
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
      </ScrollView>

      {/* Rodapé Fixo */}
      {isFooterVisible && (
        <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
          <View style={styles.footer}>
          <CaptureButton
            onPress={() => setShowCaptureModal(true)}
            title="Captura Rápida"
            subtitle="Identificação inteligente de dados"
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <OdometerIcon size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/fuel-history/${selectedVehicle.id}`)}
            >
              <Fuel size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FuelTankIcon size={24} color="#fff" level={0.6} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Gauge size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Droplet size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
      )}

      {/* Modal */}
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

      {/* Chat Screen */}
      <ChatScreen
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        vehicleName={`${selectedVehicle.name} ${selectedVehicle.model}`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  chatButton: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 200,
  },
  processingBanner: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
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
    borderColor: '#3b82f6',
    borderTopColor: 'transparent',
    borderRadius: 10,
  },
  processingText: {
    color: '#2563eb',
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
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dateDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  activitiesContainer: {
    gap: 16,
  },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#e5e7eb',
    borderRightColor: '#e5e7eb',
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  actionButton: {
    width: 56,
    height: 56,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
