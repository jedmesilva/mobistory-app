import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
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
        <Info size={20} color={Colors.text.tertiary} />
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
    color: Colors.primary.dark,
  },
  label: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    lineHeight: 18,
  },
});
