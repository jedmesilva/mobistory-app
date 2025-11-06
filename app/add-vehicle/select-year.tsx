import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { YearInput, VehicleHeader, QuickCaptureButton } from '@/components/add-vehicle';
import { StyleSheet } from 'react-native';
import type { VehicleData } from './index';

interface SelectYearScreenProps {
  vehicleData?: VehicleData;
  onYearSelected: (year: string) => void;
  onBack: () => void;
  onShowCaptureModal: () => void;
}

export default function SelectYearScreen({ vehicleData, onYearSelected, onBack, onShowCaptureModal }: SelectYearScreenProps) {
  const [year, setYear] = React.useState(vehicleData?.year || '');

  const handleSubmit = () => {
    if (year.trim()) {
      onYearSelected(year);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <VehicleHeader
        onBack={onBack}
        hasAutoData={false}
        vehicleData={{} as any}
        colors={[]}
        progress={(4 / 7) * 100}
        isFirstStep={false}
      />
      <YearInput
        value={year}
        onChangeText={setYear}
        onSubmitEditing={handleSubmit}
      />

      {/* Botão de Captura Rápida */}
      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Capturar Ano"
        description="Identificar ano de fabricação"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
});
