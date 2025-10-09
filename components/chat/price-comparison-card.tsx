import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
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
          <MapPin size={16} color={Colors.background.primary} />
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
                  <TrendingUp size={10} color={Colors.error.DEFAULT} />
                ) : (
                  <TrendingDown size={10} color={Colors.success.DEFAULT} />
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
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
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
    backgroundColor: Colors.success.DEFAULT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
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
    color: Colors.primary.dark,
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  priceContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
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
    backgroundColor: Colors.error.light,
  },
  trendBadgeDown: {
    backgroundColor: Colors.success.light,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  trendTextUp: {
    color: Colors.error.DEFAULT,
  },
  trendTextDown: {
    color: Colors.success.DEFAULT,
  },
});
