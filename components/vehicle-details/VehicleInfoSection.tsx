import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Car } from 'lucide-react-native';

interface InfoItem {
  label: string;
  value: string;
  isBold?: boolean;
  isFullWidth?: boolean;
}

interface VehicleInfoSectionProps {
  items: InfoItem[];
}

export const VehicleInfoSection = ({ items }: VehicleInfoSectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Car size={20} color={Colors.primary.light} />
        <Text style={styles.sectionTitle}>Informações do Veículo</Text>
      </View>
      <View style={styles.sectionContent}>
        <View style={styles.grid}>
          {items.map((item, index) => (
            <View
              key={index}
              style={[styles.gridItem, item.isFullWidth && styles.gridItemFull]}
            >
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={item.isBold ? styles.gridValueBold : styles.gridValue}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  sectionContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  gridItemFull: {
    width: '100%',
  },
  gridLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  gridValueBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
});
