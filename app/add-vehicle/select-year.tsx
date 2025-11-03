import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { YearInput, VehicleHeader } from '@/components/add-vehicle';
import { StyleSheet } from 'react-native';

interface SelectYearScreenProps {
  onYearSelected: (year: string) => void;
  onBack: () => void;
}

export default function SelectYearScreen({ onYearSelected, onBack }: SelectYearScreenProps) {
  const [year, setYear] = React.useState('');

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
});
