import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Activity, TrendingUp, TrendingDown, Fuel } from 'lucide-react-native';
import { StatBox } from './StatBox';

interface MonthlyStats {
  abastecimentos: number;
  totalLiters: number;
  totalKm: number;
}

interface Comparison {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface Comparisons {
  spending: Comparison;
  consumption: Comparison;
  volume: Comparison;
  price: Comparison;
}

interface MonthlyStatsCardProps {
  monthName: string;
  monthlyStats: MonthlyStats;
  comparisons: Comparisons;
  formatCurrency: (value: number) => string;
}

export const MonthlyStatsCard = ({
  monthName,
  monthlyStats,
  comparisons,
  formatCurrency,
}: MonthlyStatsCardProps) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return <TrendingUp size={16} color="#16a34a" />;
    } else if (trend === 'down') {
      return <TrendingDown size={16} color={Colors.error.dark} />;
    }
    return null;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '#16a34a';
      case 'down':
        return Colors.error.dark;
      default:
        return Colors.text.secondary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Activity size={16} color={Colors.text.secondary} />
          <Text style={styles.cardHeaderText}>{monthName}</Text>
        </View>
        <Text style={styles.cardHeaderSubtext}>
          {monthlyStats.abastecimentos} abastecimentos
        </Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.statsGrid}>
          {/* Gasto Total */}
          <StatBox
            label="Gasto Total"
            value={formatCurrency(comparisons.spending.value)}
            trend={getTrendIcon(comparisons.spending.trend)}
            subtitle={`${comparisons.spending.change > 0 ? '+' : ''}${comparisons.spending.change.toFixed(1)}% vs anterior`}
            trendColor={getTrendColor(comparisons.spending.trend)}
          />

          {/* Consumo Médio */}
          <StatBox
            label="Consumo Médio"
            value={`${comparisons.consumption.value.toFixed(1)} km/L`}
            trend={getTrendIcon(comparisons.consumption.trend)}
            subtitle={`${comparisons.consumption.change > 0 ? '+' : ''}${comparisons.consumption.change.toFixed(1)} vs anterior`}
            trendColor={getTrendColor(comparisons.consumption.trend)}
          />

          {/* Total de Litros */}
          <StatBox
            label="Total Litros"
            value={`${monthlyStats.totalLiters.toFixed(1)}L`}
            trend={<Fuel size={16} color={Colors.text.secondary} />}
            subtitle={`${monthlyStats.totalKm.toLocaleString()} km rodados`}
          />

          {/* Preço Médio */}
          <StatBox
            label="Preço Médio"
            value={formatCurrency(comparisons.price.value)}
            subtitle="por litro"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  cardHeaderSubtext: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  cardBody: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
