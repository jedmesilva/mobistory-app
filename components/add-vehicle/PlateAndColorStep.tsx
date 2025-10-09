import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants';
import { StepHeader } from './StepHeader';
import { ColorSelector, ColorOption } from './ColorSelector';

interface PlateAndColorStepProps {
  plateValue: string;
  selectedColor: string;
  colors: ColorOption[];
  onPlateChange: (text: string) => void;
  onColorSelect: (colorId: string) => void;
  onSubmitEditing?: () => void;
}

export const PlateAndColorStep = ({
  plateValue,
  selectedColor,
  colors,
  onPlateChange,
  onColorSelect,
  onSubmitEditing,
}: PlateAndColorStepProps) => {
  return (
    <View style={styles.stepContainer}>
      <StepHeader title="Placa e Cor" subtitle="Últimas informações básicas" />

      <View style={styles.fieldGroup}>
        <TextInput
          value={plateValue}
          onChangeText={onPlateChange}
          placeholder="Placa (Ex: ABC-1234)"
          maxLength={8}
          autoCapitalize="characters"
          style={[styles.input, styles.inputCenter, styles.inputMono]}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="next"
        />

        <ColorSelector
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={onColorSelect}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    gap: 24,
    padding: 24,
  },
  fieldGroup: {
    gap: 24,
  },
  input: {
    fontSize: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    color: Colors.primary.dark,
  },
  inputCenter: {
    textAlign: 'center',
  },
  inputMono: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
