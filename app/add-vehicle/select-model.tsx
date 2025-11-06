import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car } from 'lucide-react-native';
import { Colors } from '@/constants';
import {
  SearchableInput,
  StepHeader,
  VehicleHeader,
  QuickCaptureButton,
  type SuggestionItem,
} from '@/components/add-vehicle';
import type { VehicleData } from './index';

interface SelectModelScreenProps {
  catalog: any;
  vehicleData: VehicleData;
  onModelSelected: (data: Partial<VehicleData>) => void;
  onBack: () => void;
  onShowCaptureModal: () => void;
}

export default function SelectModelScreen({
  catalog,
  vehicleData,
  onModelSelected,
  onBack,
  onShowCaptureModal,
}: SelectModelScreenProps) {
  const [modelSearch, setModelSearch] = useState('');
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  // Carregar modelos quando marca existir
  useEffect(() => {
    if (vehicleData.brand_id && !vehicleData.isNewBrand) {
      catalog.loadModels(vehicleData.brand_id);
    } else {
      catalog.resetModel();
    }
  }, [vehicleData.brand_id, vehicleData.isNewBrand]);

  const getFilteredModels = (): SuggestionItem[] => {
    const filtered = modelSearch
      ? catalog.models.filter((model: any) =>
          model.name.toLowerCase().includes(modelSearch.toLowerCase())
        )
      : catalog.models;

    return filtered.map((m: any) => ({
      name: m.name,
      verified: m.verified,
    }));
  };

  const handleModelSelect = (modelName: string) => {
    setModelSearch(modelName);
    setSelectedModel(modelName);
    setShowModelSuggestions(false);

    // Buscar modelo existente na lista local
    const existingModel = catalog.models.find(
      (m: any) => m.name.toLowerCase() === modelName.toLowerCase()
    );

    if (existingModel) {
      // Modelo existe
      onModelSelected({
        model_id: existingModel.id,
        model: existingModel.name,
        isNewModel: false,
      });
    } else {
      // Modelo novo
      onModelSelected({
        model_id: '',
        model: modelName,
        isNewModel: true,
      });
    }
  };

  const handleCreateNewModel = () => {
    if (modelSearch.trim()) {
      handleModelSelect(modelSearch);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <VehicleHeader
          onBack={onBack}
          hasAutoData={false}
          vehicleData={{} as any}
          colors={[]}
          progress={(2 / 7) * 100}
          isFirstStep={false}
        />

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
              setShowModelSuggestions(true);
            }}
            placeholder="Ex: Civic, Corolla, Gol..."
            showSuggestions={showModelSuggestions}
            suggestions={getFilteredModels()}
            selectedValue={selectedModel}
            onSelectSuggestion={handleModelSelect}
            onCreateNew={handleCreateNewModel}
            createNewLabel={
              modelSearch && getFilteredModels().length === 0
                ? `Novo modelo: "${modelSearch}"`
                : modelSearch
                ? 'Novo modelo'
                : 'Digite o nome do modelo acima'
            }
            successMessage={
              selectedModel
                ? `Modelo selecionado: ${vehicleData.brand} ${selectedModel}`
                : undefined
            }
            onClear={() => {
              setModelSearch('');
              setSelectedModel('');
              setShowModelSuggestions(true);
            }}
            onSubmitEditing={() =>
              selectedModel && handleCreateNewModel()
            }
            autoFocus
          />
        </View>
      </ScrollView>

      {/* Botão de Captura Rápida */}
      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Capturar Modelo"
        description="Identificar modelo do veículo"
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
