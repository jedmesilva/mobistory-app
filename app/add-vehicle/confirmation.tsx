import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { ConfirmationScreen as ConfirmationComponent, type ColorOption, type FuelTypeOption } from '@/components/add-vehicle';
import type { VehicleData } from './index';

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
      4: 'plate-color',
      5: 'fuel',
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 200 },
});
