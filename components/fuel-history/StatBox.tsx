import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface StatBoxProps {
  label: string;
  value: string;
  trend?: ReactNode;
  subtitle: string;
  trendColor?: string;
}

export const StatBox = ({ label, value, trend, subtitle, trendColor }: StatBoxProps) => {
  return (
    <View style={styles.statBox}>
      <View style={styles.statBoxHeader}>
        <Text style={styles.statBoxLabel}>{label}</Text>
        {trend}
      </View>
      <Text style={styles.statBoxValue}>{value}</Text>
      <Text style={[styles.statBoxSubtitle, trendColor && { color: trendColor }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statBox: {
    width: '48%',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  statBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statBoxLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  statBoxValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  statBoxSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
});
