import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, MapPin } from 'lucide-react-native';

interface Station {
  name: string;
  address: string;
  prices?: {
    gasolina_comum?: string;
    gasolina_aditivada?: string;
    etanol?: string;
    diesel?: string;
  };
}

interface SelectedStationBannerProps {
  station: Station;
  onChangeStation: () => void;
}

export const SelectedStationBanner = ({ station, onChangeStation }: SelectedStationBannerProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Check size={16} color="#4b5563" />
        <Text style={styles.headerText}>Posto Selecionado</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.name}>{station.name}</Text>
            <View style={styles.addressRow}>
              <MapPin size={12} color="#6b7280" />
              <Text style={styles.address}>{station.address}</Text>
            </View>

            {station.prices && Object.keys(station.prices).length > 0 && (
              <View style={styles.pricesBox}>
                <Text style={styles.pricesTitle}>Preços de referência do posto:</Text>
                <View style={styles.pricesGrid}>
                  {station.prices.gasolina_comum && (
                    <Text style={styles.priceText}>
                      Comum: <Text style={styles.priceValue}>R$ {station.prices.gasolina_comum}</Text>
                    </Text>
                  )}
                  {station.prices.gasolina_aditivada && (
                    <Text style={styles.priceText}>
                      Aditivada: <Text style={styles.priceValue}>R$ {station.prices.gasolina_aditivada}</Text>
                    </Text>
                  )}
                  {station.prices.etanol && (
                    <Text style={styles.priceText}>
                      Etanol: <Text style={styles.priceValue}>R$ {station.prices.etanol}</Text>
                    </Text>
                  )}
                  {station.prices.diesel && (
                    <Text style={styles.priceText}>
                      Diesel: <Text style={styles.priceValue}>R$ {station.prices.diesel}</Text>
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={onChangeStation}>
            <Text style={styles.changeButton}>Alterar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  body: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  pricesBox: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  pricesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  pricesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceText: {
    fontSize: 12,
    color: '#6b7280',
    width: '48%',
  },
  priceValue: {
    fontWeight: '500',
    color: '#111827',
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
});
