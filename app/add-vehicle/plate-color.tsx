import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { PlateAndColorStep, VehicleHeader, type ColorOption } from '@/components/add-vehicle';
import { StyleSheet } from 'react-native';

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

interface PlateColorScreenProps {
  onPlateColorSelected: (plate: string, color: string) => void;
  onBack: () => void;
}

export default function PlateColorScreen({ onPlateColorSelected, onBack }: PlateColorScreenProps) {
  const [plate, setPlate] = React.useState('');
  const [color, setColor] = React.useState('');

  const handleSubmit = () => {
    if (plate.trim() && color) {
      onPlateColorSelected(plate, color);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <VehicleHeader
        onBack={onBack}
        hasAutoData={false}
        vehicleData={{} as any}
        colors={colors}
        progress={(5 / 7) * 100}
        isFirstStep={false}
      />
      <PlateAndColorStep
        plateValue={plate}
        selectedColor={color}
        colors={colors}
        onPlateChange={setPlate}
        onColorSelect={setColor}
        onSubmitEditing={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
});
