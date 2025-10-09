import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, MapPin, AlertCircle } from 'lucide-react-native';
import {
  ProgressIndicator,
  OdometerInput,
  ConsumptionDisplay,
} from '@/components/add-fueling';
import { SmartCaptureModal } from '@/components/ui/SmartCaptureModal';
import { CaptureButton } from '@/components/ui/CaptureButton';
import { OdometerIcon } from '@/components/icons';

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

    if (kmNumber < currentVehicle.lastKm) {
      setError(`KM deve ser maior ou igual a ${currentVehicle.lastKm.toLocaleString('pt-BR')}`);
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
    if (!km) {
      return;
    }

    if (!validateKmInput()) {
      return;
    }

    setActionType('submit');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setActionType('');
      router.push('/add-fueling/summary');
    }, 800);
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
      'Gasolina Comum': { bg: Colors.error.light, text: Colors.error.text },
      'Gasolina Aditivada': { bg: Colors.error.light, text: Colors.error.text },
      'Etanol': { bg: Colors.success.light, text: Colors.success.text },
      'Diesel': { bg: Colors.warning.light, text: '#854d0e' },
      'GNV': { bg: Colors.info.light, text: Colors.info.text },
    };
    return colors[fuelType] || { bg: Colors.background.tertiary, text: Colors.primary.DEFAULT };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Quilometragem Atual</Text>
          <Text style={styles.headerSubtitle}>
            {currentVehicle.plate} • {currentVehicle.year} • {currentVehicle.color}
          </Text>
        </View>
        <ProgressIndicator currentStep={3} totalSteps={3} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Odometer Input */}
          <View style={styles.card}>
            <View style={[styles.cardHeader, styles.blueHeader]}>
              <OdometerIcon size={16} color={Colors.info.DEFAULT} />
              <Text style={styles.blueHeaderText}>Quilometragem do Odômetro</Text>
            </View>

            <View style={styles.cardBody}>
              <OdometerInput
                km={km}
                lastKm={currentVehicle.lastKm}
                lastDate={currentVehicle.lastFuel.date}
                onChangeText={handleInputChange}
              />
            </View>
          </View>

          {/* Context Section Divider */}
          <View style={styles.contextSection}>
            <Text style={styles.contextTitle}>Resumo das Etapas</Text>

            {/* Station Card */}
            <View style={styles.card}>
              <View style={[styles.cardHeader, styles.greenHeader]}>
                <Check size={16} color="#16a34a" />
                <Text style={styles.greenHeaderText}>Posto Confirmado</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.stationName}>{selectedStation.name}</Text>
                <View style={styles.addressRow}>
                  <MapPin size={12} color={Colors.text.tertiary} />
                  <Text style={styles.stationAddress}>{selectedStation.address}</Text>
                </View>
              </View>
            </View>

            {/* Fuel Summary */}
            <View style={styles.card}>
              <View style={[styles.cardHeader, styles.greenHeader]}>
                <Check size={16} color={Colors.success.text} />
                <Text style={styles.greenHeaderText}>Resumo do Abastecimento</Text>
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
                  {fuelItems.map((item, index) => {
                    const itemLiters = parseFloat(item.liters.replace(',', '.'));
                    const percentage = ((itemLiters / totalLiters) * 100).toFixed(1);
                    const colors = getFuelTypeColor(item.fuelType);
                    const isLast = index === fuelItems.length - 1;

                    return (
                      <View key={item.id} style={[styles.fuelItem, isLast && styles.fuelItemLast]}>
                        {/* Linha 1: Nome do combustível e Percentual */}
                        <View style={styles.fuelItemRow}>
                          <View style={[styles.fuelBadge, { backgroundColor: colors.bg }]}>
                            <Text style={[styles.fuelBadgeText, { color: colors.text }]}>{item.fuelType}</Text>
                          </View>
                          <View style={styles.percentageBadge}>
                            <Text style={styles.percentageText}>{percentage}%</Text>
                          </View>
                        </View>

                        {/* Linha 2: Litragem + Preço/L e Valor Total */}
                        <View style={styles.fuelItemRow}>
                          <View style={styles.fuelItemLeft}>
                            <Text style={styles.fuelLiters}>{item.liters} L</Text>
                            <Text style={styles.fuelMetaText}>• R$ {item.pricePerLiter.replace('.', ',')}/L</Text>
                          </View>
                          <Text style={styles.fuelTotalPrice}>R$ {item.totalPrice.replace('.', ',')}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <AlertCircle size={18} color={Colors.text.tertiary} />
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
              <AlertCircle size={16} color={Colors.error.dark} />
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
          <CaptureButton
            onPress={() => setShowCaptureModal(true)}
            subtitle="Detectar quilometragem automaticamente"
          />

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
              disabled={isProcessing || !km || !!error}
              style={[
                styles.submitButton,
                (isProcessing || !km || !!error) && styles.buttonDisabled
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isProcessing && actionType === 'submit'
                  ? 'Finalizando...'
                  : km
                    ? `Finalizar com ${km} km`
                    : 'Finalizar'}
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
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
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
    color: Colors.primary.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 220,
  },
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  greenHeader: {
    backgroundColor: '#f0fdf4',
  },
  greenHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success.text,
  },
  blueHeader: {
    backgroundColor: '#eff6ff',
  },
  blueHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.info.text,
  },
  sectionHeader: {
    backgroundColor: Colors.background.secondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  cardBody: {
    padding: 16,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stationAddress: {
    fontSize: 14,
    color: Colors.text.tertiary,
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
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  fuelsList: {
    gap: 16,
  },
  fuelItem: {
    gap: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  fuelItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  fuelItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuelItemLeft: {
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
  fuelLiters: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  fuelMetaText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.info.light,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.info.DEFAULT,
  },
  fuelTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 19,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: Colors.error.light,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error.dark,
    flex: 1,
  },
  processingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
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
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  contextSection: {
    marginTop: 32,
  },
  contextTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.placeholder,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    maxWidth: '100%',
  },
  footer: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
    width: '100%',
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
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
