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

      {/* Combustíveis */}
      <View style={styles.fuelsSection}>
        {fueling.fuels.map((fuel, fuelIndex) => {
          const style = getFuelTypeStyle(fuel.type);
          return (
            <View key={fuelIndex} style={styles.fuelRow}>
              <View style={styles.fuelLeft}>
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
                <Text style={styles.fuelLiters}>{fuel.liters}L</Text>
              </View>
              <View style={styles.fuelRight}>
                <Text style={styles.fuelTotalPrice}>
                  {formatCurrency(fuel.totalPrice)}
                </Text>
                <Text style={styles.fuelPricePerLiter}>
                  {formatCurrency(fuel.pricePerLiter)}/L
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer com Totais */}
      <View style={styles.fuelingFooter}>
        <View style={styles.totalsRow}>
          <View style={styles.totalItem}>
            <Text style={styles.totalValue}>
              {formatCurrency(fueling.totalValue)}
            </Text>
            <Text style={styles.totalLabel}>Total</Text>
          </View>

          <View style={styles.totalItem}>
            <Text style={styles.totalValue}>{fueling.totalLiters}L</Text>
            <Text style={styles.totalLabel}>Volume</Text>
          </View>

          {fueling.efficiency && (
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>
                {fueling.efficiency.toFixed(1)}
              </Text>
              <Text style={styles.totalLabel}>km/L</Text>
            </View>
          )}
        </View>

        <View style={styles.statusBadge}>
          <CheckCircle size={16} color="#16a34a" />
          <Text style={styles.statusText}>Completo</Text>
        </View>
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
  fuelsSection: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  fuelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fuelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fuelTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fuelTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  fuelLiters: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  fuelRight: {
    alignItems: 'flex-end',
  },
  fuelTotalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  fuelPricePerLiter: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  fuelingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  totalsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  totalItem: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.text.placeholder,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16a34a',
  },
});
