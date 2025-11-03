import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useVehicleCatalog } from '@/hooks/vehicle/useVehicleCatalog';
import { vehiclesService } from '@/lib/api/services/vehicles';
import SelectBrandScreen from './select-brand';
import SelectModelScreen from './select-model';
import SelectVersionScreen from './select-version';
import SelectYearScreen from './select-year';
import PlateColorScreen from './plate-color';
import FuelTypeScreen from './fuel-type';
import ConfirmationScreen from './confirmation';
import ProcessingScreen from './processing';

type Step = 'brand' | 'model' | 'version' | 'year' | 'plate-color' | 'fuel' | 'confirmation' | 'processing';

export interface VehicleData {
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

export default function AddVehicleFlow() {
  const router = useRouter();
  const catalog = useVehicleCatalog();

  const [currentStep, setCurrentStep] = useState<Step>('brand');
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
      // Resetar modelo e versão ao mudar marca
      model_id: '',
      model: '',
      isNewModel: false,
      version_id: '',
      name: '',
      isNewVersion: false,
    }));
    setCurrentStep('model');
  };

  const handleModelSelected = (data: Partial<VehicleData>) => {
    setVehicleData(prev => ({
      ...prev,
      ...data,
      // Resetar versão ao mudar modelo
      version_id: '',
      name: '',
      isNewVersion: false,
    }));
    setCurrentStep('version');
  };

  const handleVersionSelected = (data: Partial<VehicleData>) => {
    setVehicleData(prev => ({ ...prev, ...data }));
    setCurrentStep('year');
  };

  const handleYearSelected = (year: string) => {
    setVehicleData(prev => ({ ...prev, year }));
    setCurrentStep('plate-color');
  };

  const handlePlateColorSelected = (plate: string, color: string) => {
    setVehicleData(prev => ({ ...prev, plate, color }));
    setCurrentStep('fuel');
  };

  const handleFuelTypeSelected = (fuelType: string) => {
    setVehicleData(prev => ({ ...prev, fuelType }));
    setCurrentStep('confirmation');
  };

  // Handler de confirmação final
  const handleConfirm = async () => {
    try {
      setCurrentStep('processing');

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
      console.log('Criando veículo');
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
      router.back();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      // TODO: Mostrar mensagem de erro e voltar para confirmation
      setCurrentStep('confirmation');
    }
  };

  // Handlers de navegação para voltar
  const handleBackFromModel = () => setCurrentStep('brand');
  const handleBackFromVersion = () => setCurrentStep('model');
  const handleBackFromYear = () => setCurrentStep('version');
  const handleBackFromPlateColor = () => setCurrentStep('year');
  const handleBackFromFuel = () => setCurrentStep('plate-color');
  const handleBackFromConfirmation = () => setCurrentStep('fuel');

  const handleEdit = (step: Step) => {
    setCurrentStep(step);
  };

  // Renderização condicional baseada na etapa
  switch (currentStep) {
    case 'brand':
      return (
        <SelectBrandScreen
          catalog={catalog}
          onBrandSelected={handleBrandSelected}
          onBack={() => router.back()}
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
          onYearSelected={handleYearSelected}
          onBack={handleBackFromYear}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'plate-color':
      return (
        <PlateColorScreen
          onPlateColorSelected={handlePlateColorSelected}
          onBack={handleBackFromPlateColor}
          onShowCaptureModal={handleOpenQuickCapture}
        />
      );

    case 'fuel':
      return (
        <FuelTypeScreen
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
