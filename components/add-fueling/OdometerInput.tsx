import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface OdometerInputProps {
  km: string;
  lastKm: number;
  lastDate: string;
  onChangeText: (value: string) => void;
}

export const OdometerInput = ({ km, lastKm, lastDate, onChangeText }: OdometerInputProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Quilometragem atual</Text>
        <TextInput
          value={km}
          onChangeText={onChangeText}
          placeholder="90.000"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.inputHint}>quilômetros</Text>
      </View>

      <View style={styles.lastKmBox}>
        <Text style={styles.lastKmLabel}>Última quilometragem registrada</Text>
        <Text style={styles.lastKmValue}>{lastKm.toLocaleString('pt-BR')} km</Text>
        <Text style={styles.lastKmDate}>Em {new Date(lastDate).toLocaleDateString('pt-BR')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    color: '#111827',
  },
  inputHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  lastKmBox: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  lastKmLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  lastKmValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  lastKmDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
