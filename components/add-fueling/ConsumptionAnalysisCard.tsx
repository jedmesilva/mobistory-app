import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';

interface ConsumptionAnalysisCardProps {
  consumption: string;
  status: {
    label: string;
    message: string;
  };
}

export const ConsumptionAnalysisCard = ({ consumption, status }: ConsumptionAnalysisCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.value}>{consumption} km/L</Text>
          <Text style={styles.label}>Consumo no período</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Info size={20} color="#6b7280" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Avaliação do Consumo</Text>
          <Text style={styles.infoText}>{status.message}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
});
