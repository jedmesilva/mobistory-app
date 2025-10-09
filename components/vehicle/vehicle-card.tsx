import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Car, ChevronRight } from 'lucide-react-native';

interface VehicleCardProps {
  vehicle: any;
  isHistorical?: boolean;
  navigateToVehicleHistory: (vehicle: any) => void;
  relationshipConfig: {[key: string]: any};
}

export const VehicleCard = ({
  vehicle,
  isHistorical = false,
  navigateToVehicleHistory,
  relationshipConfig
}: VehicleCardProps) => {
  const config = relationshipConfig[vehicle.relationshipType];

  return (
    <Pressable
      onPress={() => navigateToVehicleHistory(vehicle)}
      style={[
        styles.card,
        isHistorical && styles.cardHistorical
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconBox, isHistorical && styles.iconBoxHistorical]}>
          <Car size={28} color={Colors.background.primary} />
        </View>

        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, isHistorical && styles.textHistorical]}>
            {vehicle.name} {vehicle.model}
          </Text>

          <Text style={styles.cardSubtitle}>
            {vehicle.plate} • {vehicle.color} • {vehicle.year}
          </Text>

          <View style={[styles.badge, isHistorical && styles.badgeHistorical]}>
            <Text style={[styles.badgeText, isHistorical && styles.badgeTextHistorical]}>
              {config.label}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>INÍCIO</Text>
              <Text style={[styles.footerValue, isHistorical && styles.textHistorical]}>
                {vehicle.relationshipStart}
              </Text>
            </View>

            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, styles.footerLabelRight]}>ÚLTIMO EVENTO</Text>
              <Text style={[styles.footerValue, styles.footerValueRight, isHistorical && styles.textHistorical]}>
                {vehicle.lastEvent}
              </Text>
            </View>
          </View>
        </View>

        <ChevronRight
          size={20}
          color={isHistorical ? Colors.text.placeholder : Colors.text.tertiary}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 12,
    padding: 16,
  },
  cardHistorical: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxHistorical: {
    backgroundColor: Colors.text.placeholder,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeHistorical: {
    backgroundColor: Colors.background.tertiary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.light,
  },
  badgeTextHistorical: {
    color: Colors.text.tertiary,
  },
  textHistorical: {
    color: Colors.text.tertiary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
    gap: 16,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  footerLabelRight: {
    textAlign: 'right',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  footerValueRight: {
    textAlign: 'right',
  },
});
