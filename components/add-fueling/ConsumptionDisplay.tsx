import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ConsumptionDisplayProps {
  km: string;
  lastKm: number;
  estimatedConsumption: string | null;
}

export const ConsumptionDisplay = ({ km, lastKm, estimatedConsumption }: ConsumptionDisplayProps) => {
  if (!km) return null;

  const distance = parseInt(km.replace(/[^\d]/g, '')) - lastKm;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Distância percorrida:</Text>
      <Text style={styles.value}>{distance.toLocaleString('pt-BR')} km</Text>

      {estimatedConsumption && (
        <>
          <Text style={styles.label}>Consumo estimado do período anterior:</Text>
          <Text style={styles.value}>{estimatedConsumption} km/L</Text>
          <Text style={styles.note}>Baseado no último abastecimento</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 4,
  },
});
