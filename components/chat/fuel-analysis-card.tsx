import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fuel, TrendingDown } from 'lucide-react-native';

interface FuelAnalysisCardProps {
  volume: string;
  consumption: string;
  price: string;
}

export const FuelAnalysisCard = ({ volume, consumption, price }: FuelAnalysisCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Fuel size={16} color="#fff" />
        </View>
        <Text style={styles.title}>Análise de Abastecimento</Text>
      </View>

      <View style={styles.volumeSection}>
        <Text style={styles.volumeLabel}>Volume abastecido</Text>
        <Text style={styles.volumeValue}>{volume}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Consumo médio</Text>
          <Text style={styles.statValue}>{consumption}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <View style={styles.priceHeader}>
            <Text style={styles.statLabel}>Preço médio/L</Text>
            <View style={styles.trendBadge}>
              <TrendingDown size={12} color="#10b981" />
              <Text style={styles.trendText}>-5%</Text>
            </View>
          </View>
          <Text style={styles.statValue}>{price}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  volumeSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  volumeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  volumeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
});
