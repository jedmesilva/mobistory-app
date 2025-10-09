import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Car, AlertCircle } from 'lucide-react-native';
import { OdometerIcon, FuelTankIcon } from '../icons';

interface VehicleStatusCardProps {
  odometer: number;
  fuelLevel: number;
  autonomy: number;
}

export const VehicleStatusCard = ({
  odometer,
  fuelLevel,
  autonomy,
}: VehicleStatusCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Car size={16} color={Colors.text.secondary} />
        <Text style={styles.cardHeaderText}>Status Atual</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <OdometerIcon size={20} color={Colors.text.secondary} />
            </View>
            <View>
              <Text style={styles.statValue}>{odometer.toLocaleString()} km</Text>
              <Text style={styles.statLabel}>Quilometragem</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <FuelTankIcon size={20} color={Colors.text.secondary} level={fuelLevel / 100} />
            </View>
            <View>
              <Text style={styles.statValue}>{fuelLevel}%</Text>
              <Text style={styles.statLabel}>Combustível</Text>
            </View>
          </View>
        </View>

        <View style={styles.autonomyBanner}>
          <View style={styles.autonomyHeader}>
            <AlertCircle size={16} color={Colors.text.secondary} />
            <Text style={styles.autonomyTitle}>Autonomia atual</Text>
          </View>
          <Text style={styles.autonomyText}>
            Aproximadamente {autonomy} km restantes
          </Text>
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
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  cardBody: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  autonomyBanner: {
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.background.tertiary,
  },
  autonomyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  autonomyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  autonomyText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
