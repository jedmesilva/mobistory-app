import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        <Car size={20} color="#374151" />
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
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
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  gridItemFull: {
    width: '100%',
  },
  gridLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  gridValueBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
});
