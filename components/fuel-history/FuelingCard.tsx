import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import {
  MapPin,
  Calendar,
  MoreHorizontal,
  CheckCircle,
} from 'lucide-react-native';
import { OdometerIcon } from '../icons';

interface FuelItem {
  type: string;
  liters: number;
  pricePerLiter: number;
  totalPrice: number;
}

interface Station {
  name: string;
  brand: string;
  address: string;
}

interface Fueling {
  id: number;
  date: string;
  time: string;
  station: Station;
  odometer: number;
  fuels: FuelItem[];
  totalLiters: number;
  totalValue: number;
  efficiency: number;
  kmTraveled: number;
  status: string;
}

interface FuelingCardProps {
  fueling: Fueling;
  formatDate: (date: string) => string;
  formatCurrency: (value: number) => string;
  getFuelTypeStyle: (type: string) => { bg: string; text: string };
}

export const FuelingCard = ({
  fueling,
  formatDate,
  formatCurrency,
  getFuelTypeStyle,
}: FuelingCardProps) => {
  return (
    <View style={styles.fuelingCard}>
      {/* Header do Card */}
      <View style={styles.fuelingHeader}>
        <View style={styles.fuelingHeaderLeft}>
          <View style={styles.fuelingTitleRow}>
            <Text style={styles.fuelingStationName}>{fueling.station.name}</Text>
            <Text style={styles.fuelingId}>
              #{fueling.id.toString().padStart(3, '0')}
            </Text>
          </View>
          <View style={styles.fuelingAddressRow}>
            <MapPin size={12} color={Colors.text.tertiary} />
            <Text style={styles.fuelingAddress}>{fueling.station.address}</Text>
          </View>
          <View style={styles.fuelingMetaRow}>
            <View style={styles.fuelingMeta}>
              <Calendar size={12} color={Colors.text.placeholder} />
              <Text style={styles.fuelingMetaText}>
                {formatDate(fueling.date)} às {fueling.time}
              </Text>
            </View>
            <View style={styles.fuelingMeta}>
              <OdometerIcon size={12} color={Colors.text.placeholder} />
              <Text style={styles.fuelingMetaText}>
                {fueling.odometer.toLocaleString()} km
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={16} color={Colors.text.placeholder} />
        </TouchableOpacity>
      </View>

      {/* Totais */}
      <View style={styles.totalsSection}>
        <View style={styles.totalItem}>
          <Text style={styles.totalValue}>{fueling.totalLiters} L</Text>
          <Text style={styles.totalLabel}>Total de litros</Text>
        </View>
        <View style={styles.totalItemRight}>
          <Text style={styles.totalValue}>{formatCurrency(fueling.totalValue)}</Text>
          <Text style={styles.totalLabel}>Valor total</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Combustíveis */}
      <View style={styles.fuelsSection}>
        {fueling.fuels.map((fuel, fuelIndex) => {
          const style = getFuelTypeStyle(fuel.type);
          const percentage = ((fuel.liters / fueling.totalLiters) * 100).toFixed(1);
          const isLast = fuelIndex === fueling.fuels.length - 1;

          return (
            <View key={fuelIndex} style={[styles.fuelItem, isLast && styles.fuelItemLast]}>
              {/* Linha 1: Nome do combustível e Percentual */}
              <View style={styles.fuelRow}>
                <View
                  style={[
                    styles.fuelTypeBadge,
                    { backgroundColor: style.bg },
                  ]}
                >
                  <Text style={[styles.fuelTypeText, { color: style.text }]}>
                    {fuel.type}
                  </Text>
                </View>
                <View style={styles.percentageBadge}>
                  <Text style={styles.percentageText}>{percentage}%</Text>
                </View>
              </View>

              {/* Linha 2: Litragem + Preço/L e Valor Total */}
              <View style={styles.fuelRow}>
                <View style={styles.fuelLeft}>
                  <Text style={styles.fuelLiters}>{fuel.liters} L</Text>
                  <Text style={styles.fuelMetaText}>• {formatCurrency(fuel.pricePerLiter)}/L</Text>
                </View>
                <Text style={styles.fuelTotalPrice}>
                  {formatCurrency(fuel.totalPrice)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fuelingCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  fuelingHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  fuelingHeaderLeft: {
    flex: 1,
  },
  fuelingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fuelingStationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  fuelingId: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.placeholder,
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fuelingAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  fuelingAddress: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  fuelingMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  fuelingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fuelingMetaText: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  moreButton: {
    padding: 4,
  },
  totalsSection: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background.tertiary,
  },
  fuelsSection: {
    padding: 16,
  },
  fuelItem: {
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  fuelItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  fuelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fuelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fuelTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fuelTypeText: {
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
  fuelLiters: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  fuelMetaText: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  fuelTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  totalItem: {
    flex: 1,
  },
  totalItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.text.tertiary,
  },
});
