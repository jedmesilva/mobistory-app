import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { ConfirmationScreen as ConfirmationComponent, type ColorOption, type FuelTypeOption } from '@/components/add-vehicle';
import type { VehicleData } from './index';
import { useColors } from '@/lib/api/hooks';
import { Check } from 'lucide-react-native';

const fuelTypes: FuelTypeOption[] = [
  { id: 'gasoline', label: 'Gasolina', icon: 'fuel' },
  { id: 'ethanol', label: 'Etanol', icon: 'fuel' },
  { id: 'flex', label: 'Flex (Gasolina + Etanol)', icon: 'fuel' },
  { id: 'diesel', label: 'Diesel', icon: 'fuel' },
  { id: 'electric', label: 'Elétrico', icon: 'electric' },
  { id: 'hybrid', label: 'Híbrido', icon: 'hybrid' },
];

interface ConfirmationScreenProps {
  vehicleData: VehicleData;
  onConfirm: () => void;
  onEdit: (step: any) => void;
  onBack: () => void;
}

export default function ConfirmationScreen({
  vehicleData,
  onConfirm,
  onEdit,
  onBack,
}: ConfirmationScreenProps) {
  // Buscar cores da API
  const { colors: apiColors } = useColors({ verified_only: false, active_only: true });

  // Converter cores da API e adicionar cor personalizada se necessário
  const colors: ColorOption[] = useMemo(() => {
    const colorOptions = apiColors.map(c => ({
      id: c.id,
      label: c.name,
      hex: c.hex_code || '#CCCCCC',
      finishType: c.finish_type,
    }));

    // Se há uma cor personalizada que ainda não está na lista, adicionar
    if (vehicleData.isNewColor && vehicleData.color) {
      const colorExists = colorOptions.some(c => c.label === vehicleData.color);
      if (!colorExists) {
        colorOptions.push({
          id: 'custom',
          label: vehicleData.color,
          hex: '#E5E7EB',
          finishType: vehicleData.colorFinishType,
        });
      }
    }

    return colorOptions;
  }, [apiColors, vehicleData.isNewColor, vehicleData.color, vehicleData.colorFinishType]);

  // Converter vehicleData para o formato esperado pelo ConfirmationComponent
  const formattedData = {
    brand: vehicleData.brand,
    model: vehicleData.model,
    name: vehicleData.name,
    year: vehicleData.year,
    plate: vehicleData.plate,
    color: vehicleData.color,
    fuelType: vehicleData.fuelType,
  };

  const handleEdit = (stepIndex: number) => {
    const stepMap: Record<number, string> = {
      0: 'brand',
      1: 'model',
      2: 'version',
      3: 'year',
      4: 'plate',
      5: 'color',
      6: 'fuel',
    };
    onEdit(stepMap[stepIndex]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ConfirmationComponent
          vehicleData={formattedData}
          colors={colors}
          fuelTypes={fuelTypes}
          onEdit={handleEdit}
        />
      </ScrollView>

      {/* Botão fixo de confirmação */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Check size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Cadastrar Veículo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 200 },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.DEFAULT,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    shadowColor: Colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
