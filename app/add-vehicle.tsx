import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Zap,
  ChevronRight,
  Camera,
  Mic,
  Image as ImageIcon,
  Car,
  Check,
  Edit3,
  Sparkles,
  Plus,
  Search,
  Fuel,
} from 'lucide-react-native';

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

const fuelTypes = [
  { id: 'gasoline', label: 'Gasolina' },
  { id: 'ethanol', label: 'Etanol' },
  { id: 'flex', label: 'Flex (Gasolina + Etanol)' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'electric', label: 'Elétrico' },
  { id: 'hybrid', label: 'Híbrido' },
];

const colors = [
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
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);

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
            {!vehicleData.brand && (
              <View style={styles.stepHeader}>
                <View style={styles.stepIcon}>
                  <Search size={32} color="#fff" />
                </View>
                <Text style={styles.stepTitle}>Qual a marca do veículo?</Text>
                <Text style={styles.stepSubtitle}>Digite para buscar na lista</Text>
              </View>
            )}

            {vehicleData.brand && (
              <View style={styles.successBanner}>
                <Check size={20} color="#10b981" />
                <Text style={styles.successText}>Marca selecionada: {vehicleData.brand}</Text>
              </View>
            )}

            <View>
              <TextInput
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
                style={styles.input}
                autoFocus
              />

              {showBrandSuggestions && (
                <Pressable onPress={(e) => e.stopPropagation()}>
                  <View style={styles.suggestionsContainer}>
                <ScrollView
                  style={styles.suggestionsList}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="always"
                >
                  {getFilteredBrands().map((brand) => (
                    <TouchableOpacity
                      key={brand}
                      onPress={() => handleBrandSelect(brand)}
                      style={styles.suggestionItem}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionText}>{brand}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={handleCreateNewBrand}
                    style={styles.createNewItem}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color="#3b82f6" />
                    <Text style={styles.createNewText}>
                      {brandSearch && getFilteredBrands().length === 0
                        ? `Criar nova marca: "${brandSearch}"`
                        : 'Criar nova marca'}
                    </Text>
                  </TouchableOpacity>
                  </ScrollView>
                </View>
                </Pressable>
              )}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            {!vehicleData.model && (
              <View style={styles.stepHeader}>
                <View style={styles.stepIcon}>
                  <Car size={32} color="#fff" />
                </View>
                <Text style={styles.stepTitle}>Modelo da {vehicleData.brand}</Text>
                <Text style={styles.stepSubtitle}>Digite para buscar ou criar novo</Text>
              </View>
            )}

            {vehicleData.model && (
              <View style={styles.successBanner}>
                <Check size={20} color="#10b981" />
                <Text style={styles.successText}>
                  Modelo selecionado: {vehicleData.brand} {vehicleData.model}
                </Text>
              </View>
            )}

            <View>
              <TextInput
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
                style={styles.input}
                autoFocus
              />

              {showModelSuggestions && (
                <Pressable onPress={(e) => e.stopPropagation()}>
                  <View style={styles.suggestionsContainer}>
                <ScrollView
                  style={styles.suggestionsList}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="always"
                >
                  {getFilteredModels().map((model) => (
                    <TouchableOpacity
                      key={model}
                      onPress={() => handleModelSelect(model)}
                      style={styles.suggestionItem}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionText}>{model}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={handleCreateNewModel}
                    style={styles.createNewItem}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color="#3b82f6" />
                    <Text style={styles.createNewText}>
                      {modelSearch && getFilteredModels().length === 0
                        ? `Criar novo modelo: "${modelSearch}"`
                        : 'Criar novo modelo'}
                    </Text>
                  </TouchableOpacity>
                  </ScrollView>
                </View>
                </Pressable>
              )}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIcon}>
                <Edit3 size={32} color="#fff" />
              </View>
              <Text style={styles.stepTitle}>Versão ou especificação</Text>
              <Text style={styles.stepSubtitle}>Ex: EXL, GLI, Comfort, Highline...</Text>
            </View>

            <TextInput
              value={vehicleData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Ex: EXL, G4, Comfort..."
              style={styles.input}
              autoFocus
            />

            {vehicleData.name && (
              <View style={styles.previewBanner}>
                <Text style={styles.previewText}>
                  {vehicleData.brand} {vehicleData.model} {vehicleData.name}
                </Text>
              </View>
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Ano do veículo</Text>
              <Text style={styles.stepSubtitle}>Em que ano foi fabricado?</Text>
            </View>

            <TextInput
              value={vehicleData.year}
              onChangeText={(text) => handleInputChange('year', text)}
              placeholder="Ex: 2020"
              keyboardType="number-pad"
              maxLength={4}
              style={[styles.input, styles.inputCenter]}
              autoFocus
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Placa e Cor</Text>
              <Text style={styles.stepSubtitle}>Últimas informações básicas</Text>
            </View>

            <View style={styles.fieldGroup}>
              <TextInput
                value={vehicleData.plate}
                onChangeText={(text) => handleInputChange('plate', text.toUpperCase())}
                placeholder="Placa (Ex: ABC-1234)"
                maxLength={8}
                style={[styles.input, styles.inputCenter, styles.inputMono]}
              />

              <View style={styles.colorSection}>
                <Text style={styles.colorLabel}>Cor do veículo</Text>
                <View style={styles.colorGrid}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color.id}
                      onPress={() => handleInputChange('color', color.id)}
                      style={[
                        styles.colorButton,
                        vehicleData.color === color.id && styles.colorButtonActive,
                      ]}
                    >
                      <View
                        style={[styles.colorCircle, { backgroundColor: color.hex }]}
                      />
                      <Text style={styles.colorText}>{color.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Tipo de Combustível</Text>
              <Text style={styles.stepSubtitle}>Que combustível seu veículo aceita?</Text>
            </View>

            <View style={styles.fuelTypeList}>
              {fuelTypes.map((fuel) => (
                <TouchableOpacity
                  key={fuel.id}
                  onPress={() => handleInputChange('fuelType', fuel.id)}
                  style={[
                    styles.fuelTypeButton,
                    vehicleData.fuelType === fuel.id && styles.fuelTypeButtonActive,
                  ]}
                >
                  <Fuel size={24} color="#4b5563" />
                  <Text style={styles.fuelTypeText}>{fuel.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
          disabled={currentStep === 0 && !hasAutoData}
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
              <View style={styles.progressCircle}>
                <Svg width={48} height={48} style={styles.progressSvg}>
                  <Circle
                    cx={24}
                    cy={24}
                    r={20}
                    stroke="#E5E7EB"
                    strokeWidth={4}
                    fill="none"
                  />
                  <Circle
                    cx={24}
                    cy={24}
                    r={20}
                    stroke="#3B82F6"
                    strokeWidth={4}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - getStepProgress() / 100)}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="24, 24"
                  />
                </Svg>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>{Math.round(getStepProgress())}%</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <Pressable
        style={styles.content}
        onPress={() => {
          setShowBrandSuggestions(false);
          setShowModelSuggestions(false);
        }}
      >
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
              <View style={styles.stepHeader}>
                <View style={[styles.stepIcon, styles.stepIconSuccess]}>
                  <Check size={32} color="#fff" />
                </View>
                <Text style={styles.stepTitle}>Confirme os dados do veículo</Text>
                <Text style={styles.stepSubtitle}>Confira e edite se necessário</Text>
              </View>

              <View style={styles.confirmationCard}>
                <TouchableOpacity
                  onPress={() => handleEdit(0)}
                  style={styles.confirmationField}
                >
                  <View>
                    <Text style={styles.confirmationLabel}>Marca</Text>
                    <Text style={styles.confirmationValue}>{vehicleData.brand}</Text>
                  </View>
                  <Edit3 size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleEdit(1)}
                  style={styles.confirmationField}
                >
                  <View>
                    <Text style={styles.confirmationLabel}>Modelo</Text>
                    <Text style={styles.confirmationValue}>{vehicleData.model}</Text>
                  </View>
                  <Edit3 size={16} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleEdit(2)}
                  style={styles.confirmationField}
                >
                  <View>
                    <Text style={styles.confirmationLabel}>Versão</Text>
                    <Text style={styles.confirmationValue}>{vehicleData.name}</Text>
                  </View>
                  <Edit3 size={16} color="#9ca3af" />
                </TouchableOpacity>

                <View style={styles.confirmationRow}>
                  <TouchableOpacity
                    onPress={() => handleEdit(3)}
                    style={styles.confirmationFieldHalf}
                  >
                    <Text style={styles.confirmationLabel}>Ano</Text>
                    <Text style={styles.confirmationValue}>{vehicleData.year}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleEdit(4)}
                    style={styles.confirmationFieldHalf}
                  >
                    <Text style={styles.confirmationLabel}>Placa</Text>
                    <Text style={[styles.confirmationValue, styles.confirmationValueMono]}>
                      {vehicleData.plate}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.confirmationRow}>
                  <TouchableOpacity
                    onPress={() => handleEdit(4)}
                    style={styles.confirmationFieldHalf}
                  >
                    <Text style={styles.confirmationLabel}>Cor</Text>
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
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleEdit(5)}
                    style={styles.confirmationFieldHalf}
                  >
                    <Text style={styles.confirmationLabel}>Combustível</Text>
                    <Text style={styles.confirmationValue}>
                      {fuelTypes.find((f) => f.id === vehicleData.fuelType)?.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            renderStep()
          )}
        </ScrollView>
      </Pressable>

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
                  {isEditMode ? 'Salvar Alteração' : currentStep === 5 ? 'Finalizar' : 'Continuar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Capture Modal */}
      <Modal
        visible={showCaptureModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCaptureModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCaptureModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Captura Automática</Text>
              <Text style={styles.modalSubtitle}>
                Envie documento ou foto para preenchimento automático
              </Text>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity
                onPress={() => simulateAutoCapture('camera')}
                style={styles.modalOption}
              >
                <View style={styles.modalOptionIcon}>
                  <Camera size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Tirar Foto</Text>
                  <Text style={styles.modalOptionSubtitle}>Do documento ou veículo</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => simulateAutoCapture('voice')}
                style={styles.modalOption}
              >
                <View style={styles.modalOptionIcon}>
                  <Mic size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Comando de Voz</Text>
                  <Text style={styles.modalOptionSubtitle}>
                    Fale as informações do veículo
                  </Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => simulateAutoCapture('gallery')}
                style={styles.modalOption}
              >
                <View style={styles.modalOptionIcon}>
                  <ImageIcon size={24} color="#fff" />
                </View>
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>Enviar da Galeria</Text>
                  <Text style={styles.modalOptionSubtitle}>
                    Foto ou arquivo do documento
                  </Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowCaptureModal(false)}
              style={styles.modalCancel}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  progressCircle: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  content: {
    flex: 1,
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
  stepHeader: {
    alignItems: 'center',
    gap: 8,
  },
  stepIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepIconSuccess: {
    backgroundColor: '#10b981',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
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
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#fff',
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  suggestionsList: {
    maxHeight: 238,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionText: {
    fontSize: 16,
    color: '#111827',
  },
  createNewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  createNewText: {
    fontSize: 16,
    color: '#3b82f6',
  },
  fieldGroup: {
    gap: 24,
  },
  colorSection: {
    gap: 12,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: '22%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  colorButtonActive: {
    borderColor: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  fuelTypeList: {
    gap: 12,
  },
  fuelTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  fuelTypeButtonActive: {
    borderColor: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  fuelTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
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
  confirmationField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  confirmationFieldHalf: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  confirmationRow: {
    flexDirection: 'row',
    gap: 16,
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  confirmationValueMono: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
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
    gap: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
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
    fontWeight: '500',
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
    fontWeight: '500',
    color: '#6b7280',
  },
});
