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
      <Text style={styles.label}>Total Geral</Text>
      <View style={styles.values}>
        <Text style={styles.liters}>{totalLiters.toFixed(1)} L</Text>
        <Text style={styles.price}>R$ {totalValue.toFixed(2).replace('.', ',')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.secondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  values: {
    alignItems: 'flex-end',
  },
  liters: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  price: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
