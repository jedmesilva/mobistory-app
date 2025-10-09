import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
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
  onEdit?: (index: number) => void;
  onRemove?: (index: number) => void;
  getFuelTypeColor: (fuelType: string) => { bg: string; text: string };
  isLast?: boolean;
  showActions?: boolean;
}

export const FuelItemCard = ({
  item,
  index,
  totalLiters,
  onEdit,
  onRemove,
  getFuelTypeColor,
  isLast = false,
  showActions = true,
}: FuelItemCardProps) => {
  const itemLiters = parseFloat(item.liters.replace(',', '.'));
  const percentage = ((itemLiters / totalLiters) * 100).toFixed(1);
  const colors = getFuelTypeColor(item.fuelType);

  return (
    <View style={[
      styles.container,
      !showActions && styles.containerNoActions,
      isLast && styles.containerLast
    ]}>
      {/* Linha 1: Nome do combustível e Percentual */}
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>{item.fuelType}</Text>
        </View>
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>

      {/* Linha 2: Litragem + Preço/L e Valor Total */}
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.liters}>{item.liters} L</Text>
          <Text style={styles.metaText}>• R$ {item.pricePerLiter}/L</Text>
        </View>
        <Text style={styles.totalPrice}>R$ {item.totalPrice}</Text>
      </View>

      {/* Linha 3: Ações (opcional) */}
      {showActions && onEdit && onRemove && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(index)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeButton}>
            <X size={16} color={Colors.error.dark} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  containerNoActions: {
    gap: 8,
    paddingBottom: 16,
  },
  containerLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.info.light,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.info.DEFAULT,
  },
  liters: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  metaText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
