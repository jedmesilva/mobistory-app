import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react-native';

interface Station {
  name: string;
  distance: string;
  price: string;
  trend: 'up' | 'down';
  trendValue: string;
}

interface PriceComparisonCardProps {
  stations: Station[];
}

export const PriceComparisonCard = ({ stations }: PriceComparisonCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MapPin size={16} color="#fff" />
        </View>
        <Text style={styles.title}>Postos Próximos</Text>
      </View>

      <View style={styles.content}>
        {stations.map((station, index) => (
          <View key={index} style={styles.stationRow}>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationDistance}>{station.distance}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{station.price}</Text>
              <View style={[
                styles.trendBadge,
                station.trend === 'up' ? styles.trendBadgeUp : styles.trendBadgeDown
              ]}>
                {station.trend === 'up' ? (
                  <TrendingUp size={10} color="#ef4444" />
                ) : (
                  <TrendingDown size={10} color="#10b981" />
                )}
                <Text style={[
                  styles.trendText,
                  station.trend === 'up' ? styles.trendTextUp : styles.trendTextDown
                ]}>
                  {station.trendValue}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
    backgroundColor: '#10b981',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    gap: 12,
  },
  stationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendBadgeUp: {
    backgroundColor: '#fee2e2',
  },
  trendBadgeDown: {
    backgroundColor: '#d1fae5',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  trendTextUp: {
    color: '#ef4444',
  },
  trendTextDown: {
    color: '#10b981',
  },
});
