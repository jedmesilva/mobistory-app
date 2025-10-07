import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { StepHeader } from './StepHeader';

interface YearInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
}

export const YearInput = ({ value, onChangeText, onSubmitEditing }: YearInputProps) => {
  return (
    <View style={styles.stepContainer}>
      <StepHeader title="Ano do veículo" subtitle="Em que ano foi fabricado?" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ex: 2020"
        keyboardType="number-pad"
        maxLength={4}
        style={[styles.input, styles.inputCenter]}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="next"
        autoFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    gap: 24,
  },
  input: {
    fontSize: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    color: '#111827',
  },
  inputCenter: {
    textAlign: 'center',
  },
});
