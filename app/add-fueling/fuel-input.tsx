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
import { ArrowLeft, AlertCircle, Check, Edit3 } from 'lucide-react-native';
import {
  ProgressIndicator,
  SelectedStationBanner,
  FuelItemCard,
  AddFuelForm,
  FuelSummaryCard,
} from '@/components/add-fueling';
import { SmartCaptureModal } from '@/components/ui/SmartCaptureModal';
import { CaptureButton } from '@/components/ui/CaptureButton';

interface FuelItem {
  id: number;
  fuelType: string;
  liters: string;
  pricePerLiter: string;
  totalPrice: string;
}

export default function FuelInputScreen() {
  const router = useRouter();
  const [fuelItems, setFuelItems] = useState<FuelItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    liters: '',
    pricePerLiter: '',
    totalPrice: '',
    fuelType: '',
  });
  const [editingItem, setEditingItem] = useState({
    liters: '',
    pricePerLiter: '',
    totalPrice: '',
    fuelType: '',
  });
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showCaptureModal, setShowCaptureModal] = useState(false);

  const currentVehicle = {
    name: 'Honda Civic',
    year: '2020',
    plate: 'ABC-1234',
  };

  const selectedStation = {
    id: 1,
    name: 'Shell Select',
    brand: 'Shell',
    address: 'Av. Paulista, 1500 - Bela Vista',
    prices: {
      gasolina_comum: '5.49',
      gasolina_aditivada: '5.69',
      etanol: '3.89',
      diesel: '5.99',
    },
  };

  const fuelTypes = [
    { id: 'gasolina_comum', name: 'Gasolina Comum', color: { bg: Colors.error.light, text: Colors.error.text } },
    { id: 'gasolina_aditivada', name: 'Gasolina Aditivada', color: { bg: Colors.error.light, text: Colors.error.text } },
    { id: 'etanol', name: 'Etanol', color: { bg: Colors.success.light, text: Colors.success.text } },
    { id: 'diesel', name: 'Diesel', color: { bg: Colors.warning.light, text: '#854d0e' } },
    { id: 'gnv', name: 'GNV', color: { bg: Colors.info.light, text: Colors.info.text } },
  ];

  const formatPrice = (value: string) => value.replace(/[^\d,]/g, '');

  const canAddItem = () => {
    const hasType = !!currentItem.fuelType;
    const hasLiters = !!currentItem.liters;
    const hasPrice = !!currentItem.pricePerLiter;
    const hasTotal = !!currentItem.totalPrice;

    return hasType && ((hasLiters && hasPrice) || (hasTotal && hasPrice) || (hasTotal && hasLiters));
  };

  const getCalculatedValues = () => {
    const liters = parseFloat(currentItem.liters.replace(',', '.') || '0');
    const price = parseFloat(currentItem.pricePerLiter.replace(',', '.') || '0');
    const total = parseFloat(currentItem.totalPrice.replace(',', '.') || '0');

    if (currentItem.liters && currentItem.pricePerLiter && !currentItem.totalPrice) {
      const calculatedTotal = (liters * price).toFixed(2);
      return `Total: R$ ${calculatedTotal.replace('.', ',')}`;
    } else if (currentItem.totalPrice && currentItem.pricePerLiter && !currentItem.liters) {
      const calculatedLiters = (total / price).toFixed(2);
      return `Litros: ${calculatedLiters.replace('.', ',')} L`;
    } else if (currentItem.totalPrice && currentItem.liters && !currentItem.pricePerLiter) {
      const calculatedPrice = (total / liters).toFixed(3);
      return `Preço/L: R$ ${calculatedPrice.replace('.', ',')}`;
    }

    return null;
  };

  const validateCurrentItem = () => {
    if (!currentItem.fuelType) {
      setError('Selecione o tipo de combustível');
      return false;
    }

    if (!canAddItem()) {
      setError('Preencha pelo menos 2 campos (ex: litros + preço/L)');
      return false;
    }

    const liters = parseFloat(currentItem.liters.replace(',', '.') || '0');
    const price = parseFloat(currentItem.pricePerLiter.replace(',', '.') || '0');
    const total = parseFloat(currentItem.totalPrice.replace(',', '.') || '0');

    if (currentItem.liters && (liters <= 0 || liters > 100)) {
      setError('Litros deve ser entre 0,1 e 100');
      return false;
    }
    if (currentItem.pricePerLiter && price <= 0) {
      setError('Preço deve ser maior que zero');
      return false;
    }
    if (currentItem.totalPrice && total <= 0) {
      setError('Valor total deve ser maior que zero');
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'liters' || field === 'pricePerLiter' || field === 'totalPrice') {
      formattedValue = formatPrice(value);
    }
    setCurrentItem((prev) => ({ ...prev, [field]: formattedValue }));
    setError('');
  };

  const handleFuelTypeSelect = (type: typeof fuelTypes[0]) => {
    setCurrentItem((prev) => ({ ...prev, fuelType: type.name }));
    setShowFuelDropdown(false);
  };

  const handleEditInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'liters' || field === 'pricePerLiter' || field === 'totalPrice') {
      formattedValue = formatPrice(value);
    }
    setEditingItem((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const handleEditFuelTypeSelect = (type: typeof fuelTypes[0]) => {
    setEditingItem((prev) => ({ ...prev, fuelType: type.name }));
    setShowEditDropdown(false);
  };

  const canEditItem = () => {
    const hasType = !!editingItem.fuelType;
    const hasLiters = !!editingItem.liters;
    const hasPrice = !!editingItem.pricePerLiter;
    const hasTotal = !!editingItem.totalPrice;

    return hasType && ((hasLiters && hasPrice) || (hasTotal && hasPrice) || (hasTotal && hasLiters));
  };

  const getEditCalculatedValues = () => {
    const liters = parseFloat(editingItem.liters.replace(',', '.') || '0');
    const price = parseFloat(editingItem.pricePerLiter.replace(',', '.') || '0');
    const total = parseFloat(editingItem.totalPrice.replace(',', '.') || '0');

    if (editingItem.liters && editingItem.pricePerLiter && !editingItem.totalPrice) {
      const calculatedTotal = (liters * price).toFixed(2);
      return `Total: R$ ${calculatedTotal.replace('.', ',')}`;
    } else if (editingItem.totalPrice && editingItem.pricePerLiter && !editingItem.liters) {
      const calculatedLiters = (total / price).toFixed(2);
      return `Litros: ${calculatedLiters.replace('.', ',')} L`;
    } else if (editingItem.totalPrice && editingItem.liters && !editingItem.pricePerLiter) {
      const calculatedPrice = (total / liters).toFixed(3);
      return `Preço/L: R$ ${calculatedPrice.replace('.', ',')}`;
    }

    return null;
  };

  const addFuelItem = () => {
    if (validateCurrentItem()) {
      const liters = parseFloat(currentItem.liters.replace(',', '.') || '0');
      const price = parseFloat(currentItem.pricePerLiter.replace(',', '.') || '0');
      const total = parseFloat(currentItem.totalPrice.replace(',', '.') || '0');

      let finalLiters, finalPrice, finalTotal;

      if (currentItem.liters && currentItem.pricePerLiter) {
        finalLiters = currentItem.liters;
        finalPrice = currentItem.pricePerLiter;
        finalTotal = (liters * price).toFixed(2).replace('.', ',');
      } else if (currentItem.totalPrice && currentItem.pricePerLiter) {
        finalTotal = currentItem.totalPrice;
        finalPrice = currentItem.pricePerLiter;
        finalLiters = (total / price).toFixed(2).replace('.', ',');
      } else if (currentItem.totalPrice && currentItem.liters) {
        finalTotal = currentItem.totalPrice;
        finalLiters = currentItem.liters;
        finalPrice = (total / liters).toFixed(3).replace('.', ',');
      }

      const newItem: FuelItem = {
        id: Date.now(),
        fuelType: currentItem.fuelType,
        liters: finalLiters!,
        pricePerLiter: finalPrice!,
        totalPrice: finalTotal!,
      };

      setFuelItems((prev) => [...prev, newItem]);
      setCurrentItem({
        liters: '',
        pricePerLiter: '',
        totalPrice: '',
        fuelType: '',
      });
    }
  };

  const updateFuelItem = () => {
    if (editingIndex === null) return;

    const liters = parseFloat(editingItem.liters.replace(',', '.') || '0');
    const price = parseFloat(editingItem.pricePerLiter.replace(',', '.') || '0');
    const total = parseFloat(editingItem.totalPrice.replace(',', '.') || '0');

    let finalLiters, finalPrice, finalTotal;

    if (editingItem.liters && editingItem.pricePerLiter) {
      finalLiters = editingItem.liters;
      finalPrice = editingItem.pricePerLiter;
      finalTotal = (liters * price).toFixed(2).replace('.', ',');
    } else if (editingItem.totalPrice && editingItem.pricePerLiter) {
      finalTotal = editingItem.totalPrice;
      finalPrice = editingItem.pricePerLiter;
      finalLiters = (total / price).toFixed(2).replace('.', ',');
    } else if (editingItem.totalPrice && editingItem.liters) {
      finalTotal = editingItem.totalPrice;
      finalLiters = editingItem.liters;
      finalPrice = (total / liters).toFixed(3).replace('.', ',');
    }

    const updatedItem: FuelItem = {
      id: fuelItems[editingIndex].id,
      fuelType: editingItem.fuelType,
      liters: finalLiters!,
      pricePerLiter: finalPrice!,
      totalPrice: finalTotal!,
    };

    const updatedItems = [...fuelItems];
    updatedItems[editingIndex] = updatedItem;
    setFuelItems(updatedItems);
    setEditingIndex(null);
    setEditingItem({
      liters: '',
      pricePerLiter: '',
      totalPrice: '',
      fuelType: '',
    });
  };

  const editFuelItem = (index: number) => {
    const item = fuelItems[index];
    setEditingItem({
      liters: item.liters,
      pricePerLiter: item.pricePerLiter,
      totalPrice: item.totalPrice,
      fuelType: item.fuelType,
    });
    setEditingIndex(index);
  };

  const removeFuelItem = (index: number) => {
    setFuelItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingItem({
        liters: '',
        pricePerLiter: '',
        totalPrice: '',
        fuelType: '',
      });
      setEditingIndex(null);
    }
  };

  const handleContinue = () => {
    if (fuelItems.length === 0) {
      setError('Adicione pelo menos um combustível');
      return;
    }
    router.push('/add-fueling/odometer-input');
  };

  const simulateFuelCapture = (method: string) => {
    setShowCaptureModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      const mockLiters = (Math.random() * 30 + 20).toFixed(1).replace('.', ',');
      const mockPrice = (Math.random() * 2 + 4).toFixed(2).replace('.', ',');
      const mockFuelType = fuelTypes[Math.floor(Math.random() * 3)]; // Gasolina Comum, Aditivada ou Etanol

      // Calcula o total
      const litersNum = parseFloat(mockLiters.replace(',', '.'));
      const priceNum = parseFloat(mockPrice.replace(',', '.'));
      const totalPrice = (litersNum * priceNum).toFixed(2).replace('.', ',');

      // Cria o item completo
      const newItem: FuelItem = {
        id: Date.now(),
        fuelType: mockFuelType.name,
        liters: mockLiters,
        pricePerLiter: mockPrice,
        totalPrice: totalPrice,
      };

      // Adiciona diretamente na lista
      setFuelItems((prev) => [...prev, newItem]);
      setIsProcessing(false);
    }, 2000);
  };

  const totalLiters = fuelItems.reduce((sum, item) => sum + parseFloat(item.liters.replace(',', '.')), 0);
  const totalValue = fuelItems.reduce((sum, item) => sum + parseFloat(item.totalPrice.replace(',', '.')), 0);

  const getFuelTypeColor = (fuelType: string) => {
    const type = fuelTypes.find((t) => t.name === fuelType);
    return type ? type.color : { bg: Colors.background.tertiary, text: Colors.primary.DEFAULT };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Registrar Abastecimento</Text>
          <Text style={styles.headerSubtitle}>
            {currentVehicle.name} • {currentVehicle.plate}
          </Text>
        </View>
        <ProgressIndicator currentStep={2} totalSteps={3} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Add Fuel Form - Always visible */}
          <AddFuelForm
            currentItem={currentItem}
            fuelTypes={fuelTypes}
            editingIndex={null}
            showFuelDropdown={showFuelDropdown}
            canAddItem={canAddItem()}
            calculatedValue={getCalculatedValues()}
            onInputChange={handleInputChange}
            onFuelTypeSelect={handleFuelTypeSelect}
            onToggleDropdown={() => setShowFuelDropdown(!showFuelDropdown)}
            onAddItem={addFuelItem}
            onCancelEdit={() => {}}
          />

          {/* Editing Form - Show when editing (replaces the list) */}
          {editingIndex !== null && (
            <View style={styles.card}>
              <View style={[styles.cardHeader, styles.editHeader]}>
                <Edit3 size={16} color={Colors.info.text} />
                <View style={styles.headerContent}>
                  <Text style={styles.editHeaderText}>Editando Combustível</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingIndex(null);
                      setEditingItem({ liters: '', pricePerLiter: '', totalPrice: '', fuelType: '' });
                    }}
                  >
                    <Text style={styles.cancelLink}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardBody}>
                <AddFuelForm
                  currentItem={editingItem}
                  fuelTypes={fuelTypes}
                  editingIndex={editingIndex}
                  showFuelDropdown={showEditDropdown}
                  canAddItem={canEditItem()}
                  calculatedValue={getEditCalculatedValues()}
                  onInputChange={handleEditInputChange}
                  onFuelTypeSelect={handleEditFuelTypeSelect}
                  onToggleDropdown={() => setShowEditDropdown(!showEditDropdown)}
                  onAddItem={updateFuelItem}
                  onCancelEdit={() => {
                    setEditingIndex(null);
                    setEditingItem({ liters: '', pricePerLiter: '', totalPrice: '', fuelType: '' });
                  }}
                  inline={true}
                />
              </View>
            </View>
          )}

          {/* Added Fuels - Only show when NOT editing */}
          {fuelItems.length > 0 && editingIndex === null && (
            <View style={styles.card}>
              <View style={[styles.cardHeader, styles.greenHeader]}>
                <Check size={16} color={Colors.success.text} />
                <Text style={styles.greenHeaderText}>Combustíveis Adicionados</Text>
              </View>

              <View style={styles.cardBody}>
                <FuelSummaryCard totalLiters={totalLiters} totalValue={totalValue} />
              </View>

              <View style={styles.fuelsList}>
                {fuelItems.map((item, index) => (
                  <FuelItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    totalLiters={totalLiters}
                    onEdit={editFuelItem}
                    onRemove={removeFuelItem}
                    getFuelTypeColor={getFuelTypeColor}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Context Section Divider */}
          <View style={styles.contextSection}>
            <Text style={styles.contextTitle}>Resumo das Etapas</Text>

            {/* Selected Station */}
            <SelectedStationBanner
              station={selectedStation}
              onChangeStation={() => router.back()}
            />
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
              <Text style={styles.processingText}>Detectando valores...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <View style={styles.footer}>
          <CaptureButton
            onPress={() => setShowCaptureModal(true)}
            subtitle="Detectar valores automaticamente"
          />

          <TouchableOpacity
            onPress={handleContinue}
            disabled={fuelItems.length === 0 || isProcessing}
            style={[styles.continueButton, (fuelItems.length === 0 || isProcessing) && styles.continueButtonDisabled]}
          >
            <Text style={[styles.continueButtonText, (fuelItems.length === 0 || isProcessing) && styles.continueButtonTextDisabled]}>
              {isProcessing ? 'Processando...' : `Continuar (${fuelItems.length} item${fuelItems.length > 1 ? 's' : ''})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Capture Modal */}
      <SmartCaptureModal
        visible={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onCapture={simulateFuelCapture}
        title="Captura Rápida"
        subtitle="Preencha automaticamente os litros abastecidos"
        options={{
          camera: 'Fotografe o painel da bomba',
          voice: 'Fale a quantidade de litros',
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
    paddingBottom: 200,
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBody: {
    padding: 16,
  },
  cancelLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  sectionHeader: {
    backgroundColor: Colors.background.secondary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  greenHeader: {
    backgroundColor: '#f0fdf4',
  },
  greenHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success.text,
  },
  editHeader: {
    backgroundColor: '#eff6ff',
  },
  editHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.info.text,
  },
  fuelsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
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
  },
  footer: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  continueButton: {
    margin: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.background.tertiary,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  continueButtonTextDisabled: {
    color: Colors.text.placeholder,
  },
});
