import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { Colors } from '@/constants';
import {
  SearchableInput,
  StepHeader,
  VehicleHeader,
  QuickCaptureButton,
  type SuggestionItem,
} from '@/components/add-vehicle';
import type { VehicleData } from './index';

interface SelectBrandScreenProps {
  catalog: any;
  onBrandSelected: (data: Partial<VehicleData>) => void;
  onBack: () => void;
  onShowCaptureModal: () => void; // Navega para /quick-capture
}

export default function SelectBrandScreen({
  catalog,
  onBrandSelected,
  onBack,
  onShowCaptureModal,
}: SelectBrandScreenProps) {
  const [brandSearch, setBrandSearch] = useState('');
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');

  const getFilteredBrands = (): SuggestionItem[] => {
    const filtered = brandSearch
      ? catalog.brands.filter((brand: any) =>
          brand.name.toLowerCase().includes(brandSearch.toLowerCase())
        )
      : catalog.brands;

    return filtered.map((b: any) => ({
      name: b.name,
      verified: b.verified,
    }));
  };

  const handleBrandSelect = (brandName: string) => {
    setBrandSearch(brandName);
    setSelectedBrand(brandName);
    setShowBrandSuggestions(false);

    // Buscar marca existente na lista local
    const existingBrand = catalog.brands.find(
      (b: any) => b.name.toLowerCase() === brandName.toLowerCase()
    );

    if (existingBrand) {
      // Marca existe - usar ID existente
      onBrandSelected({
        brand_id: existingBrand.id,
        brand: existingBrand.name,
        isNewBrand: false,
      });
    } else {
      // Marca NÃO existe - marcar para criar depois
      onBrandSelected({
        brand_id: '',
        brand: brandName,
        isNewBrand: true,
      });
    }
  };

  const handleCreateNewBrand = () => {
    if (brandSearch.trim()) {
      handleBrandSelect(brandSearch);
    }
  };

  const canProceed = () => {
    return selectedBrand.trim() !== '';
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
          progress={(1 / 7) * 100}
          isFirstStep={true}
        />

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
              setShowBrandSuggestions(true);
            }}
            placeholder="Ex: Honda, Toyota, Volkswagen..."
            showSuggestions={showBrandSuggestions}
            suggestions={getFilteredBrands()}
            selectedValue={selectedBrand}
            onSelectSuggestion={handleBrandSelect}
            onCreateNew={handleCreateNewBrand}
            createNewLabel={
              brandSearch && getFilteredBrands().length === 0
                ? `Nova marca: "${brandSearch}"`
                : brandSearch
                ? 'Nova marca'
                : 'Digite o nome da marca acima'
            }
            successMessage={
              selectedBrand ? `Marca selecionada: ${selectedBrand}` : undefined
            }
            onClear={() => {
              setBrandSearch('');
              setSelectedBrand('');
              setShowBrandSuggestions(true);
            }}
            onSubmitEditing={() => canProceed() && handleCreateNewBrand()}
            autoFocus
          />
        </View>
      </ScrollView>

      {/* Botão de Captura Rápida */}
      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Captura Rápida da Marca"
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
