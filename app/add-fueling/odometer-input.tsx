import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, MapPin, AlertCircle, Gauge, Zap, ChevronRight } from 'lucide-react-native';
import {
  ProgressIndicator,
  OdometerInput,
  ConsumptionDisplay,
} from '@/components/add-fueling';
import { SmartCaptureModal } from '@/components/ui/SmartCaptureModal';

export default function OdometerInputScreen() {
  const router = useRouter();
  const [km, setKm] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const currentVehicle = {
    name: 'Honda Civic',
    year: '2020',
    plate: 'ABC-1234',
    color: 'Preto',
    lastKm: 89450,
    lastFuel: {
      date: '2025-09-10',
      items: [{ liters: 38.5, type: 'Gasolina Comum', price: 5.49 }],
      km: 88920,
    },
  };

  const selectedStation = {
    name: 'Shell Select',
    address: 'Av. Paulista, 1500 - Bela Vista',
  };

  const fuelItems = [
    {
      id: 1,
      fuelType: 'Gasolina Comum',
      liters: '42,5',
      pricePerLiter: '5,49',
      totalPrice: '233,32',
    },
    {
      id: 2,
      fuelType: 'Etanol',
      liters: '5,0',
      pricePerLiter: '3,89',
      totalPrice: '19,45',
    },
  ];

  const formatKm = (value: string) => {
    const numValue = value.replace(/[^\d]/g, '');
    return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const totalLiters = fuelItems.reduce((sum, item) => sum + parseFloat(item.liters.replace(',', '.')), 0);
  const totalValue = fuelItems.reduce((sum, item) => sum + parseFloat(item.totalPrice.replace(',', '.')), 0);

  const validateKmInput = () => {
    if (!km) return true;

    const kmNumber = parseInt(km.replace(/[^\d]/g, ''));

    if (kmNumber <= currentVehicle.lastKm) {
      setError(`KM deve ser maior que ${currentVehicle.lastKm.toLocaleString('pt-BR')}`);
      return false;
    }

    if (kmNumber > currentVehicle.lastKm + 10000) {
      setError('KM parece muito alto. Verifique se está correto.');
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (value: string) => {
    const formattedValue = formatKm(value);
    setKm(formattedValue);
    setError('');
  };

  const handleSubmit = () => {
    if (validateKmInput()) {
      setActionType('submit');
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        setActionType('');
        router.push('/add-fueling/summary');
      }, 800);
    }
  };

  const skipKm = () => {
    setActionType('skip');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setActionType('');
      router.push('/add-fueling/summary');
    }, 800);
  };

  const simulateKmCapture = (method: string) => {
    setShowCaptureModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      const mockKm = (currentVehicle.lastKm + Math.floor(Math.random() * 500) + 100).toString();
      const formattedKm = formatKm(mockKm);
      setKm(formattedKm);
      setIsProcessing(false);
    }, 2000);
  };

  const getEstimatedConsumption = () => {
    if (!km || !currentVehicle.lastFuel.km) return null;

    const distance = parseInt(km.replace(/[^\d]/g, '')) - currentVehicle.lastFuel.km;
    const lastFuelLiters = currentVehicle.lastFuel.items.reduce((sum, item) => sum + item.liters, 0);

    if (distance > 0 && lastFuelLiters > 0) {
      return (distance / lastFuelLiters).toFixed(1);
    }

    return null;
  };

  const getFuelTypeColor = (fuelType: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      'Gasolina Comum': { bg: '#fee2e2', text: '#991b1b' },
      'Gasolina Aditivada': { bg: '#fee2e2', text: '#991b1b' },
      'Etanol': { bg: '#dcfce7', text: '#166534' },
      'Diesel': { bg: '#fef3c7', text: '#854d0e' },
      'GNV': { bg: '#dbeafe', text: '#1e40af' },
    };
    return colors[fuelType] || { bg: '#f3f4f6', text: '#1f2937' };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color="#4b5563" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Quilometragem Atual</Text>
          <Text style={styles.headerSubtitle}>
            {currentVehicle.plate} • {currentVehicle.year} • {currentVehicle.color}
          </Text>
        </View>
        <ProgressIndicator currentStep={3} totalSteps={3} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Station Card */}
          <View style={styles.card}>
            <View style={[styles.cardHeader, styles.greenHeader]}>
              <Check size={16} color="#16a34a" />
              <Text style={styles.greenHeaderText}>Posto Confirmado</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.stationName}>{selectedStation.name}</Text>
              <View style={styles.addressRow}>
                <MapPin size={12} color="#6b7280" />
                <Text style={styles.stationAddress}>{selectedStation.address}</Text>
              </View>
            </View>
          </View>

          {/* Fuel Summary */}
          <View style={styles.card}>
            <View style={[styles.cardHeader, styles.sectionHeader]}>
              <Text style={styles.sectionTitle}>Resumo do Abastecimento</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totalLiters.toFixed(1)} L</Text>
                  <Text style={styles.summaryLabel}>Total de litros</Text>
                </View>
                <View style={styles.summaryItemRight}>
                  <Text style={styles.summaryValue}>R$ {totalValue.toFixed(2).replace('.', ',')}</Text>
                  <Text style={styles.summaryLabel}>Valor total</Text>
                </View>
              </View>

              <View style={styles.fuelsList}>
                {fuelItems.map((item) => {
                  const itemLiters = parseFloat(item.liters.replace(',', '.'));
                  const percentage = ((itemLiters / totalLiters) * 100).toFixed(1);
                  const colors = getFuelTypeColor(item.fuelType);

                  return (
                    <View key={item.id} style={styles.fuelItem}>
                      <View style={styles.fuelItemHeader}>
                        <View style={[styles.fuelBadge, { backgroundColor: colors.bg }]}>
                          <Text style={[styles.fuelBadgeText, { color: colors.text }]}>{item.fuelType}</Text>
                        </View>
                        <View style={styles.percentageBadge}>
                          <Text style={styles.percentageText}>{percentage}%</Text>
                        </View>
                      </View>
                      <View style={styles.fuelItemMeta}>
                        <Text style={styles.fuelLiters}>{item.liters} L</Text>
                        <Text style={styles.fuelMetaText}>R$ {item.pricePerLiter.replace('.', ',')}/L</Text>
                        <Text style={styles.fuelMetaText}>R$ {item.totalPrice.replace('.', ',')}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Odometer Input */}
          <View style={styles.card}>
            <View style={[styles.cardHeader, styles.blueHeader]}>
              <Gauge size={16} color="#3b82f6" />
              <Text style={styles.blueHeaderText}>Quilometragem do Odômetro</Text>
            </View>

            <View style={styles.cardBody}>
              <OdometerInput
                km={km}
                lastKm={currentVehicle.lastKm}
                lastDate={currentVehicle.lastFuel.date}
                onChangeText={handleInputChange}
              />

              {km && (
                <ConsumptionDisplay
                  km={km}
                  lastKm={currentVehicle.lastKm}
                  estimatedConsumption={getEstimatedConsumption()}
                />
              )}
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <AlertCircle size={20} color="#f59e0b" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Quilometragem opcional</Text>
              <Text style={styles.warningText}>
                Você pode pular esta etapa, mas registrar a quilometragem ajuda a calcular o consumo do veículo e
                acompanhar sua eficiência.
              </Text>
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isProcessing && (
            <View style={styles.processingBox}>
              <View style={styles.spinner} />
              <Text style={styles.processingText}>Processando...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setShowCaptureModal(true)} style={styles.captureButton}>
            <View style={styles.captureButtonContent}>
              <View style={styles.captureIcon}>
                <Zap size={20} color="#fff" />
              </View>
              <View style={styles.captureTextContainer}>
                <Text style={styles.captureTitle}>Captura Automática</Text>
                <Text style={styles.captureSubtitle}>Detectar quilometragem automaticamente</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.footerActions}>
            <TouchableOpacity
              onPress={skipKm}
              disabled={isProcessing}
              style={[styles.skipButton, isProcessing && styles.buttonDisabled]}
            >
              <Text style={styles.skipButtonText}>
                {isProcessing && actionType === 'skip' ? 'Pulando...' : 'Pular'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isProcessing}
              style={[styles.submitButton, isProcessing && styles.buttonDisabled]}
            >
              <Text style={styles.submitButtonText}>
                {isProcessing && actionType === 'submit' ? 'Finalizando...' : km ? `Finalizar com KM ${km}` : 'Finalizar com KM'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Capture Modal */}
      <SmartCaptureModal
        visible={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onCapture={simulateKmCapture}
        title="Captura Rápida"
        subtitle="Preencha automaticamente a quilometragem"
        options={{
          camera: 'Fotografe o painel do odômetro',
          voice: 'Fale a quilometragem atual',
          gallery: 'Selecione foto do painel',
        }}
        disabled={isProcessing}
      />
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
    paddingBottom: 220,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  greenHeader: {
    backgroundColor: '#f0fdf4',
  },
  greenHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  blueHeader: {
    backgroundColor: '#eff6ff',
  },
  blueHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  sectionHeader: {
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cardBody: {
    padding: 16,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stationAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  fuelsList: {
    gap: 12,
  },
  fuelItem: {
    gap: 4,
  },
  fuelItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fuelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fuelBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
  },
  fuelItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 4,
  },
  fuelLiters: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  fuelMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fef3c7',
    borderRadius: 16,
    marginBottom: 16,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    flex: 1,
  },
  processingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
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
    fontSize: 14,
    color: '#6b7280',
  },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
    flex: 1,
  },
  captureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  captureSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
