import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useVehicleCatalog } from '@/hooks/vehicle/useVehicleCatalog';
import { vehiclesService, colorsService } from '@/lib/api/services';
import SelectBrandScreen from './select-brand';
import SelectModelScreen from './select-model';
import SelectVersionScreen from './select-version';
import SelectYearScreen from './select-year';
import SelectPlateScreen from './select-plate-new';
import SelectColorScreen from './select-color';
import FuelTypeScreen from './fuel-type';
import ConfirmationScreen from './confirmation';
import ProcessingScreen from './processing';

type Step = 'brand' | 'model' | 'version' | 'year' | 'plate' | 'color' | 'fuel' | 'confirmation' | 'processing';

export interface VehicleData {
  // IDs do catálogo (quando usa item existente)
  brand_id: string;
  model_id: string;
  version_id: string;
  color_id: string;

  // Nomes para exibição
  brand: string;
  model: string;
  name: string;
  color: string;

  // Flags para indicar se deve criar novo (customizado)
  isNewBrand: boolean;
  isNewModel: boolean;
  isNewVersion: boolean;
  isNewColor: boolean;

  // Dados extras da cor personalizada
  colorFinishType?: string;

  // Outros dados
  year: string;
  plate: string;
  plate_type_id: string;
  plate_model_id: string;
  fuelType: string;
}

export default function AddVehicleFlow() {
  const router = useRouter();
  const catalog = useVehicleCatalog();

  const [currentStep, setCurrentStep] = useState<Step>('brand');
  const [isEditMode, setIsEditMode] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    brand_id: '',
    model_id: '',
    version_id: '',
    color_id: '',
    brand: '',
    model: '',
    name: '',
    color: '',
    isNewBrand: false,
    isNewModel: false,
    isNewVersion: false,
    isNewColor: false,
    colorFinishType: undefined,
    year: '',
    plate: '',
    plate_type_id: '',
    plate_model_id: '',
    fuelType: '',
  });

  // Navegação para tela de captura rápida
  const handleOpenQuickCapture = () => {
    // Navegar para a tela de quick-capture passando parâmetros da etapa atual
    router.push({
      pathname: '/quick-capture',
      params: {
        context: 'vehicle-registration',
        step: currentStep,
        // Pode passar dados parciais do veículo se necessário
        vehicleData: JSON.stringify(vehicleData),
      },
    });
  };

  // Handlers de seleção
  const handleBrandSelected = (data: Partial<VehicleData>) => {
    setVehicleData(prev => ({
      ...prev,
      ...data,
      // Resetar modelo e versão ao mudar marca apenas se não estiver em modo de edição
      ...(!isEditMode && {
        model_id: '',
        model: '',
        isNewModel: false,
        version_id: '',
        name: '',
        isNewVersion: false,
      }),
    }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('model');
    }
  };

  const handleModelSelected = (data: Partial<VehicleData>) => {
    setVehicleData(prev => ({
      ...prev,
      ...data,
      // Resetar versão ao mudar modelo apenas se não estiver em modo de edição
      ...(!isEditMode && {
        version_id: '',
        name: '',
        isNewVersion: false,
      }),
    }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('version');
    }
  };

  const handleVersionSelected = (data: Partial<VehicleData>) => {
    setVehicleData(prev => ({ ...prev, ...data }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('year');
    }
  };

  const handleYearSelected = (year: string) => {
    setVehicleData(prev => ({ ...prev, year }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('plate');
    }
  };

  const handlePlateSelected = (plateTypeId: string, plateNumber: string, plateModelId: string) => {
    setVehicleData(prev => ({
      ...prev,
      plate: plateNumber,
      plate_type_id: plateTypeId,
      plate_model_id: plateModelId,
    }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('color');
    }
  };

  const handleColorSelected = (color: string, colorData?: { colorId?: string; colorName?: string; finishType?: string }) => {
    setVehicleData(prev => ({
      ...prev,
      color: colorData?.colorName || color,
      color_id: colorData?.colorId || '',
      isNewColor: !colorData?.colorId, // Se não tem colorId, é cor nova
      colorFinishType: colorData?.finishType,
    }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('fuel');
    }
  };

  const handleFuelTypeSelected = (fuelType: string) => {
    setVehicleData(prev => ({ ...prev, fuelType }));

    // Se estiver em modo de edição, volta para confirmação
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('confirmation');
    }
  };

  // Handler de confirmação final
  const handleConfirm = async () => {
    try {
      console.log('=== INICIANDO CADASTRO DE VEÍCULO ===');
      console.log('Dados do veículo:', JSON.stringify(vehicleData, null, 2));

      setCurrentStep('processing');

      let finalBrandId = vehicleData.brand_id;
      let finalModelId = vehicleData.model_id;
      let finalVersionId = vehicleData.version_id;
      let finalColorId = vehicleData.color_id;

      // 1. Criar marca se necessário
      if (vehicleData.isNewBrand) {
        console.log('>>> [1/5] Criando nova marca:', vehicleData.brand);
        const newBrand = await catalog.selectOrCreateBrand(vehicleData.brand);
        finalBrandId = newBrand.id;
        console.log('✓ Marca criada com ID:', finalBrandId);
      } else {
        console.log('>>> [1/5] Usando marca existente ID:', finalBrandId);
      }

      // 2. Criar modelo se necessário
      if (vehicleData.isNewModel && finalBrandId) {
        console.log('>>> [2/5] Criando novo modelo:', vehicleData.model, 'para marca:', finalBrandId);
        const newModel = await catalog.selectOrCreateModel(
          finalBrandId,
          vehicleData.model
        );
        finalModelId = newModel.id;
        console.log('✓ Modelo criado com ID:', finalModelId);
      } else {
        console.log('>>> [2/5] Usando modelo existente ID:', finalModelId);
      }

      // 3. Criar versão se necessário
      if (vehicleData.isNewVersion && finalBrandId && finalModelId) {
        console.log('>>> [3/5] Criando nova versão:', vehicleData.name);
        const newVersion = await catalog.selectOrCreateVersion(
          finalBrandId,
          finalModelId,
          vehicleData.name,
          {}
        );
        finalVersionId = newVersion.id;
        console.log('✓ Versão criada com ID:', finalVersionId);
      } else {
        console.log('>>> [3/5] Usando versão existente ID:', finalVersionId);
      }

      // 4. Criar cor se necessário
      if (vehicleData.isNewColor && vehicleData.color) {
        console.log('>>> [4/5] Criando nova cor:', vehicleData.color, 'finish_type:', vehicleData.colorFinishType);
        const newColor = await colorsService.create({
          name: vehicleData.color,
          finish_type: vehicleData.colorFinishType,
        });
        finalColorId = newColor.id;
        console.log('✓ Cor criada com ID:', finalColorId);
      } else {
        console.log('>>> [4/5] Usando cor existente ID:', finalColorId);
      }

      // 5. Criar o veículo com os IDs finais
      console.log('>>> [5/5] Criando veículo com dados:');
      const vehiclePayload = {
        brand_id: finalBrandId,
        model_id: finalModelId,
        version_id: finalVersionId || undefined,
        manufacturing_year: parseInt(vehicleData.year),
        model_year: parseInt(vehicleData.year),
        plate_number: vehicleData.plate,
        plate_type_id: vehicleData.plate_type_id,
        plate_model_id: vehicleData.plate_model_id || undefined,
        color_id: finalColorId || undefined,
        visibility: 'private',
      };
      console.log('Payload do veículo:', JSON.stringify(vehiclePayload, null, 2));

      const newVehicle = await vehiclesService.create(vehiclePayload);

      console.log('✓✓✓ VEÍCULO CRIADO COM SUCESSO ✓✓✓');
      console.log('Veículo:', newVehicle);
      router.back();
    } catch (error: any) {
      console.error('❌ ERRO AO SALVAR VEÍCULO ❌');
      console.error('Tipo:', error?.constructor?.name);
      console.error('Mensagem:', error?.message);
      console.error('Response data:', error?.response?.data);
      console.error('Response status:', error?.response?.status);
      console.error('Stack completa:', error);

      // TODO: Mostrar mensagem de erro e voltar para confirmation
      setCurrentStep('confirmation');
    }
  };

  // Handlers de navegação para voltar
  const handleBackFromModel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('brand');
    }
  };

  const handleBackFromVersion = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('model');
    }
  };

  const handleBackFromYear = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('version');
    }
  };

  const handleBackFromPlate = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('year');
    }
  };

  const handleBackFromColor = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('plate');
    }
  };

  const handleBackFromFuel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('color');
    }
  };

  const handleBackFromConfirmation = () => setCurrentStep('fuel');

  const handleEdit = (step: Step) => {
    setIsEditMode(true);
    setCurrentStep(step);
  };

  const handleBackFromBrand = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setCurrentStep('confirmation');
    } else {
      router.back();
    }
  };

  // Renderização condicional baseada na etapa
  switch (currentStep) {
    case 'brand':
      return (
        <SelectBrandScreen
          catalog={catalog}
          vehicleData={vehicleData}
          onBrandSelected={handleBrandSelected}
          onBack={handleBackFromBrand}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'model':
      return (
        <SelectModelScreen
          catalog={catalog}
          vehicleData={vehicleData}
          onModelSelected={handleModelSelected}
          onBack={handleBackFromModel}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'version':
      return (
        <SelectVersionScreen
          catalog={catalog}
          vehicleData={vehicleData}
          onVersionSelected={handleVersionSelected}
          onBack={handleBackFromVersion}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'year':
      return (
        <SelectYearScreen
          vehicleData={vehicleData}
          onYearSelected={handleYearSelected}
          onBack={handleBackFromYear}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'plate':
      return (
        <SelectPlateScreen
          vehicleData={vehicleData}
          onPlateSelected={handlePlateSelected}
          onBack={handleBackFromPlate}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'color':
      return (
        <SelectColorScreen
          vehicleData={vehicleData}
          onColorSelected={handleColorSelected}
          onBack={handleBackFromColor}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'fuel':
      return (
        <FuelTypeScreen
          vehicleData={vehicleData}
          onFuelTypeSelected={handleFuelTypeSelected}
          onBack={handleBackFromFuel}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'confirmation':
      return (
        <ConfirmationScreen
          vehicleData={vehicleData}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          onBack={handleBackFromConfirmation}
        />
      );

    case 'processing':
      return <ProcessingScreen />;

    default:
      return null;
  }
}
