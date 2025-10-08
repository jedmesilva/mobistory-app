import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Car,
  Edit3,
  Search,
} from 'lucide-react-native';
import {
  SearchableInput,
  StepHeader,
  FuelTypeSelector,
  VehicleHeader,
  ProcessingState,
  ConfirmationScreen,
  ActionFooter,
  YearInput,
  PlateAndColorStep,
  type ColorOption,
  type FuelTypeOption,
} from '../components/add-vehicle';
import { SmartCaptureModal } from '../components/ui/SmartCaptureModal';

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
          <YearInput
            value={vehicleData.year}
            onChangeText={(text) => handleInputChange('year', text)}
            onSubmitEditing={() => canProceed() && handleNext()}
          />
        );

      case 4:
        return (
          <PlateAndColorStep
            plateValue={vehicleData.plate}
            selectedColor={vehicleData.color}
            colors={colors}
            onPlateChange={(text) => handleInputChange('plate', text)}
            onColorSelect={(colorId) => handleInputChange('color', colorId)}
            onSubmitEditing={() => canProceed() && handleNext()}
          />
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
      <VehicleHeader
        onBack={handleBack}
        hasAutoData={hasAutoData}
        vehicleData={vehicleData}
        colors={colors}
        progress={getStepProgress()}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
          {isProcessing ? (
            <ProcessingState />
          ) : hasAutoData ? (
            <ConfirmationScreen
              vehicleData={vehicleData}
              colors={colors}
              fuelTypes={fuelTypes}
              onEdit={handleEdit}
            />
          ) : (
            renderStep()
          )}
      </ScrollView>

      {/* Footer */}
      <ActionFooter
        hasAutoData={hasAutoData}
        isProcessing={isProcessing}
        canProceed={canProceed()}
        isEditMode={isEditMode}
        currentStep={currentStep}
        onShowCaptureModal={() => setShowCaptureModal(true)}
        onSaveVehicle={handleSaveVehicle}
        onNext={handleNext}
      />

      {/* Capture Modal */}
      <SmartCaptureModal
        visible={showCaptureModal}
        onClose={() => setShowCaptureModal(false)}
        onCapture={simulateAutoCapture}
        title="Captura Automática"
        subtitle="Envie documento ou foto para preenchimento automático"
        options={{
          camera: 'Do documento ou veículo',
          voice: 'Fale as informações do veículo',
          gallery: 'Foto ou arquivo do documento',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
