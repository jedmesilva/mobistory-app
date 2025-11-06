import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette } from 'lucide-react-native';
import { Colors } from '@/constants';
import {
  ColorSelector,
  StepHeader,
  VehicleHeader,
  QuickCaptureButton,
  type ColorOption,
} from '@/components/add-vehicle';
import type { VehicleData } from './index';
import { useColors } from '@/lib/api/hooks';

interface SelectColorScreenProps {
  vehicleData?: VehicleData;
  onColorSelected: (color: string, colorData?: { colorId?: string; colorName?: string; finishType?: string }) => void;
  onBack: () => void;
  onShowCaptureModal: () => void;
}

export default function SelectColorScreen({
  vehicleData,
  onColorSelected,
  onBack,
  onShowCaptureModal,
}: SelectColorScreenProps) {
  // Se há uma cor personalizada salva, usar 'saved-custom' como ID selecionado
  const initialSelectedColor = vehicleData?.isNewColor && vehicleData?.color ? 'saved-custom' : (vehicleData?.color_id || '');
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor);
  const [colorData, setColorData] = useState<{ colorId?: string; colorName?: string; finishType?: string } | undefined>();

  // Fetch colors from API (todas as cores ativas, verificadas e não verificadas)
  const { colors: apiColors, loading, error } = useColors({ verified_only: false, active_only: true });

  // Convert API colors to ColorOption format and add custom color if exists, then "Outra cor"
  const colors: ColorOption[] = useMemo(() => {
    const colorOptions = apiColors.map(c => ({
      id: c.id,
      label: c.name,
      hex: c.hex_code || '#CCCCCC',
      finishType: c.finish_type,
    }));

    // Se já tem uma cor personalizada salva no vehicleData, adicionar ela na lista
    if (vehicleData?.isNewColor && vehicleData?.color) {
      const customColorExists = colorOptions.some(c => c.label === vehicleData.color);
      if (!customColorExists) {
        colorOptions.push({
          id: 'saved-custom',
          label: vehicleData.color,
          hex: '#E5E7EB',
          finishType: vehicleData.colorFinishType,
        });
      }
    }

    // Add "Outra cor" option at the end
    colorOptions.push({
      id: 'custom',
      label: 'Outra cor',
      hex: '#E5E7EB',
      finishType: undefined,
    });

    return colorOptions;
  }, [apiColors, vehicleData?.isNewColor, vehicleData?.color, vehicleData?.colorFinishType]);

  const handleColorSelect = (colorId: string, data?: { colorId?: string; colorName?: string; finishType?: string }) => {
    setSelectedColor(colorId);
    setColorData(data);

    // Se selecionou a cor personalizada já salva, usar os dados do vehicleData
    if (colorId === 'saved-custom') {
      const savedData = {
        colorName: vehicleData?.color,
        finishType: vehicleData?.colorFinishType,
      };
      setTimeout(() => onColorSelected(colorId, savedData), 300);
    } else {
      // Auto-avançar após seleção
      setTimeout(() => onColorSelected(colorId, data), 300);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Carregando cores...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar cores.</Text>
          <Text style={styles.errorSubtext}>Tente novamente mais tarde.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VehicleHeader
          onBack={onBack}
          hasAutoData={false}
          vehicleData={{} as any}
          colors={colors}
          progress={(6 / 8) * 100}
          isFirstStep={false}
        />

        <View style={styles.stepContainer}>
          <StepHeader
            icon={<Palette size={32} color={Colors.background.primary} />}
            title="Cor do Veículo"
            subtitle="Selecione a cor atual do seu veículo"
          />

          <ColorSelector
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={handleColorSelect}
          />
        </View>
      </ScrollView>

      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Capturar Cor"
        description="Identificar cor do veículo"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.primary.light,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error.DEFAULT,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.primary.light,
    textAlign: 'center',
  },
});
