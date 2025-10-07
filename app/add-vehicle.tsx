import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Zap,
  ChevronRight,
  Car,
  Check,
  Edit3,
  Sparkles,
  Search,
} from 'lucide-react-native';
import {
  SearchableInput,
  StepHeader,
  ColorSelector,
  FuelTypeSelector,
  ProgressCircle,
  ConfirmationField,
  CaptureModal,
  type ColorOption,
  type FuelTypeOption,
} from '../components/add-vehicle';

interface VehicleData {
  brand: string;
  model: string;
  name: string;
  year: string;
  plate: string;
  color: string;
  fuelType: string;
}

const brands = [
  'Audi', 'BMW', 'Chevrolet', 'Citroën', 'Fiat', 'Ford', 'Honda', 'Hyundai',
  'Jeep', 'Kia', 'Land Rover', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
  'Peugeot', 'Renault', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
];

const modelsByBrand: { [key: string]: string[] } = {
  'Honda': ['Accord', 'City', 'Civic', 'CR-V', 'Fit', 'HR-V', 'Pilot'],
  'Toyota': ['Camry', 'Corolla', 'Etios', 'Hilux', 'Prius', 'RAV4', 'Yaris'],
  'Volkswagen': ['Amarok', 'Fox', 'Gol', 'Golf', 'Jetta', 'Passat', 'Polo', 'T-Cross', 'Tiguan'],
  'Chevrolet': ['Captiva', 'Cruze', 'Equinox', 'Onix', 'Prisma', 'S10', 'Spin', 'Tracker'],
  'Ford': ['EcoSport', 'Edge', 'Fiesta', 'Focus', 'Fusion', 'Ka', 'Ranger', 'Territory'],
  'Fiat': ['Argo', 'Cronos', 'Ducato', 'Mobi', 'Palio', 'Siena', 'Strada', 'Toro', 'Uno'],
};

const versionsByModel: { [key: string]: string[] } = {
  'Civic': ['LX', 'LXR', 'LXS', 'EX', 'EXL', 'Sport', 'Touring', 'Si', 'Type R'],
  'Corolla': ['GLi', 'XEi', 'Altis', 'XRS', 'Hybrid'],
  'Gol': ['1.0', '1.6', 'Trendline', 'Comfortline', 'Highline', 'GTI'],
  'Onix': ['Joy', 'LT', 'LTZ', 'Premier', 'RS'],
  'Ka': ['SE', 'SE Plus', 'SEL', 'Freestyle'],
  'Argo': ['Drive', 'Trekking', 'Precision', 'HGT'],
};

const fuelTypes: FuelTypeOption[] = [
  { id: 'gasoline', label: 'Gasolina', icon: 'fuel' },
  { id: 'ethanol', label: 'Etanol', icon: 'fuel' },
  { id: 'flex', label: 'Flex (Gasolina + Etanol)', icon: 'fuel' },
  { id: 'diesel', label: 'Diesel', icon: 'fuel' },
  { id: 'electric', label: 'Elétrico', icon: 'electric' },
  { id: 'hybrid', label: 'Híbrido', icon: 'hybrid' },
];

const colors: ColorOption[] = [
  { id: 'white', label: 'Branco', hex: '#FFFFFF' },
  { id: 'black', label: 'Preto', hex: '#1F2937' },
  { id: 'gray', label: 'Cinza', hex: '#6B7280' },
  { id: 'silver', label: 'Prata', hex: '#9CA3AF' },
  { id: 'red', label: 'Vermelho', hex: '#EF4444' },
  { id: 'blue', label: 'Azul', hex: '#3B82F6' },
  { id: 'green', label: 'Verde', hex: '#10B981' },
  { id: 'yellow', label: 'Amarelo', hex: '#F59E0B' },
];

export default function AddVehicleScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAutoData, setHasAutoData] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [versionSearch, setVersionSearch] = useState('');
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showVersionSuggestions, setShowVersionSuggestions] = useState(false);

  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand: '',
    model: '',
    name: '',
    year: '',
    plate: '',
    color: '',
    fuelType: '',
  });

  const getFilteredBrands = () => {
    if (!brandSearch) return brands;
    return brands.filter((brand) =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    );
  };

  const getFilteredModels = () => {
    const models = modelsByBrand[vehicleData.brand] || [];
    if (!modelSearch) return models;
    return models.filter((model) =>
      model.toLowerCase().includes(modelSearch.toLowerCase())
    );
  };

  const getFilteredVersions = () => {
    const versions = versionsByModel[vehicleData.model] || [];
    if (!versionSearch) return versions;
    return versions.filter((version) =>
      version.toLowerCase().includes(versionSearch.toLowerCase())
    );
  };

  const simulateAutoCapture = (method: string) => {
    setShowCaptureModal(false);
    setIsProcessing(true);

    setTimeout(() => {
      const mockData: VehicleData = {
        brand: 'Honda',
        model: 'Civic',
        name: 'EXL',
        year: '2018',
        plate: 'ABC-1234',
        color: 'silver',
        fuelType: 'flex',
      };

      setVehicleData(mockData);
      setBrandSearch('Honda');
      setModelSearch('Civic');
      setVersionSearch('EXL');
      setHasAutoData(true);
      setIsProcessing(false);
      setCurrentStep(5);
    }, 2500);
  };

  const handleInputChange = (field: keyof VehicleData, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBrandSelect = (brand: string) => {
    setBrandSearch(brand);
    handleInputChange('brand', brand);
    setShowBrandSuggestions(false);
    // Limpa modelo ao trocar de marca
    handleInputChange('model', '');
    setModelSearch('');
  };

  const handleModelSelect = (model: string) => {
    setModelSearch(model);
    handleInputChange('model', model);
    setShowModelSuggestions(false);
    // Limpa versão ao trocar de modelo
    handleInputChange('name', '');
    setVersionSearch('');
  };

  const handleVersionSelect = (version: string) => {
    setVersionSearch(version);
    handleInputChange('name', version);
    setShowVersionSuggestions(false);
  };

  const handleCreateNewBrand = () => {
    if (brandSearch.trim()) {
      handleBrandSelect(brandSearch);
    }
  };

  const handleCreateNewModel = () => {
    if (modelSearch.trim()) {
      handleModelSelect(modelSearch);
    }
  };

  const handleCreateNewVersion = () => {
    if (versionSearch.trim()) {
      handleVersionSelect(versionSearch);
    }
  };

  const handleNext = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setHasAutoData(true);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      setHasAutoData(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleEdit = (step: number) => {
    setIsEditMode(true);
    setHasAutoData(false);
    setCurrentStep(step);
  };

  const handleSaveVehicle = () => {
    console.log('Salvando veículo:', vehicleData);
    router.back();
  };

  const getStepProgress = () => {
    if (hasAutoData) return 100;
    return (currentStep / 6) * 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return vehicleData.brand.trim() !== '';
      case 1:
        return vehicleData.model.trim() !== '';
      case 2:
        return vehicleData.name.trim() !== '';
      case 3:
        return vehicleData.year.trim() !== '';
      case 4:
        return vehicleData.plate.trim() !== '' && vehicleData.color !== '';
      case 5:
        return vehicleData.fuelType !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              icon={<Search size={32} color="#fff" />}
              title="Qual a marca do veículo?"
              subtitle="Digite para buscar na lista"
            />

            <SearchableInput
              value={brandSearch}
              onChangeText={(text) => {
                setBrandSearch(text);
                setShowBrandSuggestions(true);
              }}
              onFocus={() => {
                console.log('Brand input focused');
                setShowBrandSuggestions(true);
              }}
              placeholder="Ex: Honda, Toyota, Volkswagen..."
              showSuggestions={showBrandSuggestions}
              suggestions={getFilteredBrands()}
              selectedValue={vehicleData.brand}
              onSelectSuggestion={handleBrandSelect}
              onCreateNew={handleCreateNewBrand}
              createNewLabel={
                brandSearch && getFilteredBrands().length === 0
                  ? `Nova marca: "${brandSearch}"`
                  : brandSearch
                  ? 'Nova marca'
                  : 'Digite o nome da marca acima'
              }
              successMessage={vehicleData.brand ? `Marca selecionada: ${vehicleData.brand}` : undefined}
              onClear={() => {
                setBrandSearch('');
                setShowBrandSuggestions(true);
              }}
              onSubmitEditing={() => canProceed() && handleNext()}
              autoFocus
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              icon={<Car size={32} color="#fff" />}
              title={`Modelo da ${vehicleData.brand}`}
              subtitle="Digite para buscar ou criar novo"
            />

            <SearchableInput
              value={modelSearch}
              onChangeText={(text) => {
                setModelSearch(text);
                setShowModelSuggestions(true);
              }}
              onFocus={() => {
                console.log('Model input focused');
                setShowModelSuggestions(true);
              }}
              placeholder="Ex: Civic, Corolla, Gol..."
              showSuggestions={showModelSuggestions}
              suggestions={getFilteredModels()}
              selectedValue={vehicleData.model}
              onSelectSuggestion={handleModelSelect}
              onCreateNew={handleCreateNewModel}
              createNewLabel={
                modelSearch && getFilteredModels().length === 0
                  ? `Novo modelo: "${modelSearch}"`
                  : modelSearch
                  ? 'Novo modelo'
                  : 'Digite o nome do modelo acima'
              }
              successMessage={vehicleData.model ? `Modelo selecionado: ${vehicleData.brand} ${vehicleData.model}` : undefined}
              onClear={() => {
                setModelSearch('');
                setShowModelSuggestions(true);
              }}
              onSubmitEditing={() => canProceed() && handleNext()}
              autoFocus
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              icon={<Edit3 size={32} color="#fff" />}
              title="Versão ou especificação"
              subtitle="Digite para buscar ou criar nova"
            />

            <SearchableInput
              value={versionSearch}
              onChangeText={(text) => {
                setVersionSearch(text);
                setShowVersionSuggestions(true);
              }}
              onFocus={() => {
                setShowVersionSuggestions(true);
              }}
              placeholder="Ex: EXL, GLi, Comfort..."
              showSuggestions={showVersionSuggestions}
              suggestions={getFilteredVersions()}
              selectedValue={vehicleData.name}
              onSelectSuggestion={handleVersionSelect}
              onCreateNew={handleCreateNewVersion}
              createNewLabel={
                versionSearch && getFilteredVersions().length === 0
                  ? `Nova versão: "${versionSearch}"`
                  : versionSearch
                  ? 'Nova versão'
                  : 'Digite o nome da versão acima'
              }
              successMessage={vehicleData.name ? `${vehicleData.brand} ${vehicleData.model} ${vehicleData.name}` : undefined}
              onClear={() => {
                setVersionSearch('');
                setShowVersionSuggestions(true);
              }}
              onSubmitEditing={() => canProceed() && handleNext()}
              autoFocus
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              title="Ano do veículo"
              subtitle="Em que ano foi fabricado?"
            />

            <TextInput
              value={vehicleData.year}
              onChangeText={(text) => handleInputChange('year', text)}
              placeholder="Ex: 2020"
              keyboardType="number-pad"
              maxLength={4}
              style={[styles.input, styles.inputCenter]}
              onSubmitEditing={() => canProceed() && handleNext()}
              returnKeyType="next"
              autoFocus
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              title="Placa e Cor"
              subtitle="Últimas informações básicas"
            />

            <View style={styles.fieldGroup}>
              <TextInput
                value={vehicleData.plate}
                onChangeText={(text) => handleInputChange('plate', text)}
                placeholder="Placa (Ex: ABC-1234)"
                maxLength={8}
                autoCapitalize="characters"
                style={[styles.input, styles.inputCenter, styles.inputMono]}
                onSubmitEditing={() => canProceed() && handleNext()}
                returnKeyType="next"
              />

              <ColorSelector
                colors={colors}
                selectedColor={vehicleData.color}
                onSelectColor={(colorId) => handleInputChange('color', colorId)}
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              title="Tipo de Combustível"
              subtitle="Que combustível seu veículo aceita?"
            />

            <FuelTypeSelector
              fuelTypes={fuelTypes}
              selectedFuelType={vehicleData.fuelType}
              onSelectFuelType={(fuelId) => handleInputChange('fuelType', fuelId)}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#4b5563" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          {hasAutoData ? (
            <View style={styles.headerComplete}>
              <View style={styles.headerIcon}>
                <Car size={20} color="#fff" />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {vehicleData.brand} {vehicleData.model}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {vehicleData.plate}
                  {vehicleData.year && ` • ${vehicleData.year}`}
                  {vehicleData.color &&
                    ` • ${colors.find((c) => c.id === vehicleData.color)?.label}`}
                </Text>
              </View>
              <Check size={32} color="#10b981" />
            </View>
          ) : (
            <View style={styles.headerProgress}>
              <View style={styles.headerIcon}>
                <Car size={20} color="#fff" />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {vehicleData.brand
                    ? `${vehicleData.brand}${vehicleData.model ? ` ${vehicleData.model}` : ''}`
                    : 'Novo Veículo'}
                </Text>
                {(vehicleData.plate || vehicleData.year || vehicleData.color) && (
                  <Text style={styles.headerSubtitle} numberOfLines={1}>
                    {vehicleData.plate && vehicleData.plate}
                    {vehicleData.plate && vehicleData.year && ' • '}
                    {vehicleData.year && vehicleData.year}
                    {(vehicleData.plate || vehicleData.year) && vehicleData.color && ' • '}
                    {vehicleData.color &&
                      colors.find((c) => c.id === vehicleData.color)?.label}
                  </Text>
                )}
              </View>
              <ProgressCircle progress={getStepProgress()} />
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <View style={styles.processingIcon}>
                <Sparkles size={32} color="#fff" />
              </View>
              <Text style={styles.processingTitle}>Identificando seu veículo...</Text>
              <Text style={styles.processingSubtitle}>
                Processando informações automaticamente
              </Text>
            </View>
          ) : hasAutoData ? (
            <View style={styles.confirmationContainer}>
              <StepHeader
                icon={<Check size={32} color="#fff" />}
                title="Confirme os dados do veículo"
                subtitle="Revise e edite se necessário"
                isSuccess
              />

              <View style={styles.confirmationCard}>
                <ConfirmationField
                  label="Marca"
                  value={vehicleData.brand}
                  onEdit={() => handleEdit(0)}
                />

                <ConfirmationField
                  label="Modelo"
                  value={vehicleData.model}
                  onEdit={() => handleEdit(1)}
                />

                <ConfirmationField
                  label="Versão"
                  value={vehicleData.name}
                  onEdit={() => handleEdit(2)}
                />

                <View style={styles.confirmationRow}>
                  <ConfirmationField
                    label="Ano"
                    value={vehicleData.year}
                    onEdit={() => handleEdit(3)}
                    isHalf
                  />

                  <ConfirmationField
                    label="Placa"
                    value={vehicleData.plate}
                    onEdit={() => handleEdit(4)}
                    isHalf
                  />
                </View>

                <View style={styles.confirmationRow}>
                  <ConfirmationField
                    label="Cor"
                    value={colors.find((c) => c.id === vehicleData.color)?.label || ''}
                    onEdit={() => handleEdit(4)}
                    isHalf
                    renderValue={() => (
                      <View style={styles.confirmationColorRow}>
                        <View
                          style={[
                            styles.confirmationColorCircle,
                            {
                              backgroundColor: colors.find(
                                (c) => c.id === vehicleData.color
                              )?.hex,
                            },
                          ]}
                        />
                        <Text style={styles.confirmationValue}>
                          {colors.find((c) => c.id === vehicleData.color)?.label}
                        </Text>
                      </View>
                    )}
                  />

                  <ConfirmationField
                    label="Combustível"
                    value={fuelTypes.find((f) => f.id === vehicleData.fuelType)?.label || ''}
                    onEdit={() => handleEdit(5)}
                    isHalf
                  />
                </View>
              </View>
            </View>
          ) : (
            renderStep()
          )}
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <View style={styles.footer}>
          {!hasAutoData && !isProcessing && (
            <TouchableOpacity
              onPress={() => setShowCaptureModal(true)}
              style={styles.autoCaptureButton}
            >
              <View style={styles.autoCaptureIcon}>
                <Zap size={20} color="#fff" />
              </View>
              <View style={styles.autoCaptureText}>
                <Text style={styles.autoCaptureTitle}>Captura Automática</Text>
                <Text style={styles.autoCaptureSubtitle}>
                  Envie documento ou foto do veículo
                </Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}

          <View style={styles.footerActions}>
            {hasAutoData ? (
              <TouchableOpacity onPress={handleSaveVehicle} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Confirmar e Cadastrar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                disabled={!canProceed() || isProcessing}
                style={[
                  styles.primaryButton,
                  (!canProceed() || isProcessing) && styles.primaryButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    (!canProceed() || isProcessing) && styles.primaryButtonTextDisabled,
                  ]}
                >
                  {isEditMode ? 'Salvar Alteração' : currentStep === 5 ? 'Revisar dados' : 'Continuar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Capture Modal */}
      <CaptureModal
        visible={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onSelectOption={simulateAutoCapture}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 200,
  },
  stepContainer: {
    gap: 24,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 16,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#065f46',
  },
  previewBanner: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 16,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    color: '#111827',
  },
  inputCenter: {
    textAlign: 'center',
  },
  inputMono: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fieldGroup: {
    gap: 24,
  },
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  processingIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  confirmationContainer: {
    gap: 24,
  },
  confirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  confirmationRow: {
    flexDirection: 'row',
    gap: 16,
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  confirmationColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  confirmationColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  autoCaptureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  autoCaptureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoCaptureText: {
    flex: 1,
    marginLeft: 12,
  },
  autoCaptureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  autoCaptureSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerActions: {
    padding: 16,
  },
  primaryButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  primaryButtonTextDisabled: {
    color: '#6b7280',
  },
});
