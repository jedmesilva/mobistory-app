import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { FuelTypeSelector, StepHeader, VehicleHeader, type FuelTypeOption } from '@/components/add-vehicle';

const fuelTypes: FuelTypeOption[] = [
  { id: 'gasoline', label: 'Gasolina', icon: 'fuel' },
  { id: 'ethanol', label: 'Etanol', icon: 'fuel' },
  { id: 'flex', label: 'Flex (Gasolina + Etanol)', icon: 'fuel' },
  { id: 'diesel', label: 'Diesel', icon: 'fuel' },
  { id: 'electric', label: 'Elétrico', icon: 'electric' },
  { id: 'hybrid', label: 'Híbrido', icon: 'hybrid' },
];

interface FuelTypeScreenProps {
  onFuelTypeSelected: (fuelType: string) => void;
  onBack: () => void;
}

export default function FuelTypeScreen({ onFuelTypeSelected, onBack }: FuelTypeScreenProps) {
  const [selectedFuelType, setSelectedFuelType] = React.useState('');

  const handleSelect = (fuelType: string) => {
    setSelectedFuelType(fuelType);
    // Auto-avançar após seleção
    setTimeout(() => onFuelTypeSelected(fuelType), 300);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <VehicleHeader
        onBack={onBack}
        hasAutoData={false}
        vehicleData={{} as any}
        colors={[]}
        progress={(6 / 7) * 100}
        isFirstStep={false}
      />
      <View style={styles.stepContainer}>
        <StepHeader
          title="Tipo de Combustível"
          subtitle="Que combustível seu veículo aceita?"
        />
        <FuelTypeSelector
          fuelTypes={fuelTypes}
          selectedFuelType={selectedFuelType}
          onSelectFuelType={handleSelect}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  stepContainer: { gap: 24, padding: 24 },
});
