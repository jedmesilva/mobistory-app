import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  Zap,
  ChevronRight,
  Camera,
  Mic,
  Image as ImageIcon,
  Fuel,
  Wrench,
  AlertTriangle,
  MessageCircle,
  Gauge,
  CheckCircle,
  UserCheck,
  Calendar,
  ArrowLeft,
} from 'lucide-react-native';
import { OdometerIcon, FuelTankIcon } from '../../components/icons';
import { ActivityCard } from '../../components/vehicle';
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

  const simulateFuelCapture = (method: string) => {
    setShowCaptureModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      console.log(`Captura automática via ${method} concluída`);
      setIsProcessing(false);
    }, 2000);
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      simulateFuelCapture('gallery');
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      simulateFuelCapture('camera');
    }
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

              <TouchableOpacity style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>
                  {selectedVehicle.name} {selectedVehicle.model}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {selectedVehicle.year} • {selectedVehicle.plate}
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
          <TouchableOpacity onPress={() => setShowCaptureModal(true)} style={styles.captureButton}>
            <View style={styles.captureButtonContent}>
              <View style={styles.captureIcon}>
                <Zap size={20} color="#fff" />
              </View>
              <View style={styles.captureTextContainer}>
                <Text style={styles.captureTitle}>Captura inteligente</Text>
                <Text style={styles.captureSubtitle}>Identificação inteligente de dados</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <OdometerIcon size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Fuel size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FuelTankIcon size={24} color="#fff" level={0.6} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Wrench size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <AlertTriangle size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
      )}

      {/* Modal */}
      <Modal visible={showCaptureModal} transparent animationType="slide" onRequestClose={() => setShowCaptureModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowCaptureModal(false)} />

          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Captura inteligente</Text>
              <Text style={styles.modalSubtitle}>Selecione uma opção para registrar um novo evento</Text>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity onPress={handleCamera} style={styles.modalOption}>
                <View style={styles.modalOptionIcon}>
                  <Camera size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Tirar Foto</Text>
                  <Text style={styles.modalOptionSubtitle}>Fotografe os dados</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => simulateFuelCapture('voice')} style={styles.modalOption}>
                <View style={styles.modalOptionIcon}>
                  <Mic size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Falar</Text>
                  <Text style={styles.modalOptionSubtitle}>Fale os dados</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleImagePicker} style={styles.modalOption}>
                <View style={styles.modalOptionIcon}>
                  <ImageIcon size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Enviar da Galeria</Text>
                  <Text style={styles.modalOptionSubtitle}>Selecione arquivo do dispositivo</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowCaptureModal(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  captureButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureTextContainer: {
    gap: 2,
  },
  captureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  captureSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOptions: {
    gap: 12,
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalOptionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalCancel: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});
