import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
      style={({ pressed }) => [
        styles.card,
        isHistorical && styles.cardHistorical,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconBox, isHistorical && styles.iconBoxHistorical]}>
          <Car size={28} color="#fff" />
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
          color={isHistorical ? "#9ca3af" : "#6b7280"}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    padding: 16,
  },
  cardHistorical: {
    opacity: 0.7,
  },
  cardPressed: {
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
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxHistorical: {
    backgroundColor: '#9ca3af',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeHistorical: {
    backgroundColor: '#f3f4f6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  badgeTextHistorical: {
    color: '#6b7280',
  },
  textHistorical: {
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 16,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  footerLabelRight: {
    textAlign: 'right',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  footerValueRight: {
    textAlign: 'right',
  },
});
