import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface FuelSummaryCardProps {
  totalLiters: number;
  totalValue: number;
}

export const FuelSummaryCard = ({ totalLiters, totalValue }: FuelSummaryCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>{totalLiters.toFixed(1)} L</Text>
        <Text style={styles.summaryLabel}>Total de litros</Text>
      </View>
      <View style={styles.summaryItemRight}>
        <Text style={styles.summaryValue}>R$ {totalValue.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.summaryLabel}>Valor total</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
});
