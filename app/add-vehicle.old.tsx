import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
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
  type SuggestionItem,
} from '../components/add-vehicle';
import { SmartCaptureModal } from '../components/ui/SmartCaptureModal';
import { useVehicleCatalog } from '../hooks/vehicle/useVehicleCatalog';
import { vehiclesService } from '../lib/api/services/vehicles';

interface VehicleData {
  // IDs do catálogo (quando usa item existente)
  brand_id: string;
  model_id: string;
  version_id: string;

  // Nomes para exibição
  brand: string;
  model: string;
  name: string;

  // Flags para indicar se deve criar novo (customizado)
  isNewBrand: boolean;
  isNewModel: boolean;
  isNewVersion: boolean;

  // Outros dados
  year: string;
  plate: string;
  color: string;
  fuelType: string;
}

// Removido: arrays estáticos substituídos pela API

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
  const [isSaving, setIsSaving] = useState(false);

  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [versionSearch, setVersionSearch] = useState('');
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showVersionSuggestions, setShowVersionSuggestions] = useState(false);

  // Hook do catálogo
  const catalog = useVehicleCatalog();

  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand_id: '',
    model_id: '',
    version_id: '',
    brand: '',
    model: '',
    name: '',
    isNewBrand: false,
    isNewModel: false,
    isNewVersion: false,
    year: '',
    plate: '',
    color: '',
    fuelType: '',
  });

  const getFilteredBrands = (): SuggestionItem[] => {
    const filtered = brandSearch
      ? catalog.brands.filter((brand) =>
          brand.name.toLowerCase().includes(brandSearch.toLowerCase())
        )
      : catalog.brands;

    return filtered.map(b => ({
      name: b.name,
      verified: b.verified,
    }));
  };

  const getFilteredModels = (): SuggestionItem[] => {
    const filtered = modelSearch
      ? catalog.models.filter((model) =>
          model.name.toLowerCase().includes(modelSearch.toLowerCase())
        )
      : catalog.models;

    return filtered.map(m => ({
      name: m.name,
      verified: m.verified,
    }));
  };

  const getFilteredVersions = (): SuggestionItem[] => {
    const filtered = versionSearch
      ? catalog.versions.filter((version) =>
          version.name.toLowerCase().includes(versionSearch.toLowerCase())
        )
      : catalog.versions;

    return filtered.map(v => ({
      name: v.name,
      verified: v.verified,
    }));
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

  const handleBrandSelect = async (brandName: string) => {
    try {
      setBrandSearch(brandName);
      setShowBrandSuggestions(false);

      // Buscar marca existente na lista local
      const existingBrand = catalog.brands.find(
        b => b.name.toLowerCase() === brandName.toLowerCase()
      );

      if (existingBrand) {
        // Marca existe - usar ID existente
        setVehicleData(prev => ({
          ...prev,
          brand_id: existingBrand.id,
          brand: existingBrand.name,
          isNewBrand: false,
          model_id: '',
          model: '',
          isNewModel: false,
          version_id: '',
          name: '',
          isNewVersion: false,
        }));

        // Carrega modelos da marca selecionada
        await catalog.loadModels(existingBrand.id);
      } else {
        // Marca NÃO existe - marcar para criar depois
        setVehicleData(prev => ({
          ...prev,
          brand_id: '',
          brand: brandName,
          isNewBrand: true,
          model_id: '',
          model: '',
          isNewModel: false,
          version_id: '',
          name: '',
          isNewVersion: false,
        }));

        // Limpa modelos (nova marca não tem modelos ainda)
        catalog.resetModel();
      }

      // Reseta modelo e versão
      setModelSearch('');
      setVersionSearch('');
      catalog.resetVersion();
    } catch (error) {
      console.error('Error selecting brand:', error);
    }
  };

  const handleModelSelect = async (modelName: string) => {
    try {
      setModelSearch(modelName);
      setShowModelSuggestions(false);

      // Buscar modelo existente na lista local
      const existingModel = catalog.models.find(
        m => m.name.toLowerCase() === modelName.toLowerCase()
      );

      if (existingModel) {
        // Modelo existe - usar ID existente
        setVehicleData(prev => ({
          ...prev,
          model_id: existingModel.id,
          model: existingModel.name,
          isNewModel: false,
          version_id: '',
          name: '',
          isNewVersion: false,
        }));

        // Carrega versões do modelo selecionado (somente se marca também existe)
        if (vehicleData.brand_id) {
          await catalog.loadVersions(vehicleData.brand_id, existingModel.id);
        }
      } else {
        // Modelo NÃO existe - marcar para criar depois
        setVehicleData(prev => ({
          ...prev,
          model_id: '',
          model: modelName,
          isNewModel: true,
          version_id: '',
          name: '',
          isNewVersion: false,
        }));

        // Limpa versões (novo modelo não tem versões ainda)
        catalog.resetVersion();
      }

      // Reseta versão
      setVersionSearch('');
    } catch (error) {
      console.error('Error selecting model:', error);
    }
  };

  const handleVersionSelect = async (versionName: string) => {
    try {
      setVersionSearch(versionName);
      setShowVersionSuggestions(false);

      // Buscar versão existente na lista local
      const existingVersion = catalog.versions.find(
        v => v.name.toLowerCase() === versionName.toLowerCase()
      );

      if (existingVersion) {
        // Versão existe - usar ID existente
        setVehicleData(prev => ({
          ...prev,
          version_id: existingVersion.id,
          name: existingVersion.name,
          isNewVersion: false,
        }));
      } else {
        // Versão NÃO existe - marcar para criar depois
        setVehicleData(prev => ({
          ...prev,
          version_id: '',
          name: versionName,
          isNewVersion: true,
        }));
      }
    } catch (error) {
      console.error('Error selecting version:', error);
    }
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

  const handleSaveVehicle = async () => {
    try {
      setIsSaving(true);

      let finalBrandId = vehicleData.brand_id;
      let finalModelId = vehicleData.model_id;
      let finalVersionId = vehicleData.version_id;

      // 1. Criar marca se necessário
      if (vehicleData.isNewBrand) {
        console.log('Criando nova marca:', vehicleData.brand);
        const newBrand = await catalog.selectOrCreateBrand(vehicleData.brand);
        finalBrandId = newBrand.id;
      }

      // 2. Criar modelo se necessário
      if (vehicleData.isNewModel && finalBrandId) {
        console.log('Criando novo modelo:', vehicleData.model);
        const newModel = await catalog.selectOrCreateModel(
          finalBrandId,
          vehicleData.model
        );
        finalModelId = newModel.id;
      }

      // 3. Criar versão se necessário
      if (vehicleData.isNewVersion && finalBrandId && finalModelId) {
        console.log('Criando nova versão:', vehicleData.name);
        const newVersion = await catalog.selectOrCreateVersion(
          finalBrandId,
          finalModelId,
          vehicleData.name,
          {}
        );
        finalVersionId = newVersion.id;
      }

      // 4. Criar o veículo com os IDs finais
      console.log('Criando veículo com:', {
        brand_id: finalBrandId,
        model_id: finalModelId,
        version_id: finalVersionId,
      });

      const newVehicle = await vehiclesService.create({
        brand_id: finalBrandId,
        model_id: finalModelId,
        version_id: finalVersionId || undefined,
        manufacturing_year: parseInt(vehicleData.year),
        model_year: parseInt(vehicleData.year),
        current_plate: vehicleData.plate,
        current_color: vehicleData.color,
        visibility: 'private',
      });

      console.log('Veículo criado com sucesso:', newVehicle);

      // Voltar para a tela anterior
      router.back();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      // TODO: Mostrar mensagem de erro ao usuário
    } finally {
      setIsSaving(false);
    }
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

  const getCaptureModalContent = () => {
    switch (currentStep) {
      case 0:
        return {
          title: 'Captura Rápida',
          subtitle: 'Identifique automaticamente a marca',
          options: {
            camera: 'Fotografe a marca, no veículo ou no documento',
            voice: 'Fale a marca do veículo',
            gallery: 'Selecione uma foto da marca do veículo',
          },
        };
      case 1:
        return {
          title: 'Captura Rápida',
          subtitle: 'Identifique automaticamente o modelo',
          options: {
            camera: 'Fotografe o modelo, no veículo ou no documento',
            voice: 'Fale o modelo do veículo',
            gallery: 'Selecione uma foto do modelo do veículo',
          },
        };
      case 2:
        return {
          title: 'Captura Rápida',
          subtitle: 'Preencha automaticamente a versão',
          options: {
            camera: 'Fotografe a versão, no veículo ou no documento',
            voice: 'Fale a versão do veículo',
            gallery: 'Selecione uma foto da versão do veículo',
          },
        };
      case 3:
        return {
          title: 'Captura Rápida',
          subtitle: 'Preencha automaticamente o ano',
          options: {
            camera: 'Fotografe o ano no documento do veículo',
            voice: 'Fale o ano de fabricação',
            gallery: 'Selecione uma foto do ano do veículo',
          },
        };
      case 4:
        return {
          title: 'Captura Rápida',
          subtitle: 'Preencha automaticamente placa e cor',
          options: {
            camera: 'Fotografe a placa e cor, no veículo ou no documento',
            voice: 'Fale a placa e cor do veículo',
            gallery: 'Selecione uma foto da placa e cor do veículo',
          },
        };
      case 5:
        return {
          title: 'Captura Rápida',
          subtitle: 'Identifique automaticamente o tipo de combustível',
          options: {
            camera: 'Fotografe o tipo de combustível, na tampa ou no documento',
            voice: 'Fale o tipo de combustível',
            gallery: 'Selecione uma foto do tipo de combustível do veículo',
          },
        };
      default:
        return {
          title: 'Captura Rápida',
          subtitle: 'Preencha automaticamente com documento do veículo',
          options: {
            camera: 'Fotografe o documento do veículo',
            voice: 'Fale as informações do veículo',
            gallery: 'Selecione foto do documento',
          },
        };
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <StepHeader
              icon={<Search size={32} color={Colors.background.primary} />}
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
              icon={<Car size={32} color={Colors.background.primary} />}
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
              icon={<Edit3 size={32} color={Colors.background.primary} />}
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
            <>
              {/* Header */}
              <VehicleHeader
                onBack={handleBack}
                hasAutoData={hasAutoData}
                vehicleData={vehicleData}
                colors={colors}
                progress={getStepProgress()}
                isFirstStep={currentStep === 0}
              />
              {renderStep()}
            </>
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
        {...getCaptureModalContent()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  stepContainer: {
    gap: 24,
    padding: 24,
  },
});
