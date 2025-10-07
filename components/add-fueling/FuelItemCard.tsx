import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface FuelItem {
  id: number;
  fuelType: string;
  liters: string;
  pricePerLiter: string;
  totalPrice: string;
}

interface FuelItemCardProps {
  item: FuelItem;
  index: number;
  totalLiters: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  getFuelTypeColor: (fuelType: string) => { bg: string; text: string };
}

export const FuelItemCard = ({
  item,
  index,
  totalLiters,
  onEdit,
  onRemove,
  getFuelTypeColor,
}: FuelItemCardProps) => {
  const itemLiters = parseFloat(item.liters.replace(',', '.'));
  const percentage = ((itemLiters / totalLiters) * 100).toFixed(1);
  const colors = getFuelTypeColor(item.fuelType);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{item.fuelType}</Text>
          </View>
          <Text style={styles.liters}>{item.liters} L</Text>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>R$ {item.pricePerLiter}/L</Text>
          <Text style={styles.metaText}>Total: R$ {item.totalPrice}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(index)}>
          <Text style={styles.editButton}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeButton}>
          <X size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  liters: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
