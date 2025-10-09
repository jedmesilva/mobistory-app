import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { Check, MapPin, Star, X } from 'lucide-react-native';
import { Station } from './StationCard';

interface SelectedStationCardProps {
  station: Station;
  onRemove: () => void;
}

export const SelectedStationCard = ({ station, onRemove }: SelectedStationCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Check size={16} color={Colors.success.text} />
        <Text style={styles.headerText}>Posto Selecionado</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{station.name}</Text>
            {station.isFavorite && <Star size={16} color="#eab308" fill="#eab308" />}
          </View>
          <View style={styles.addressRow}>
            <MapPin size={12} color={Colors.text.tertiary} />
            <Text style={styles.address}>{station.address}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.distance}>{station.distance}</Text>
            {station.lastVisit && (
              <Text style={styles.lastVisit}>
                Último: {new Date(station.lastVisit).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>

          {station.prices && Object.keys(station.prices).length > 0 && (
            <View style={styles.pricesBox}>
              <Text style={styles.pricesTitle}>Preços disponíveis:</Text>
              <View style={styles.pricesGrid}>
                {station.prices.gasolina_comum && (
                  <Text style={styles.priceItem}>
                    Comum: <Text style={styles.priceValue}>R$ {station.prices.gasolina_comum}</Text>
                  </Text>
                )}
                {station.prices.gasolina_aditivada && (
                  <Text style={styles.priceItem}>
                    Aditivada: <Text style={styles.priceValue}>R$ {station.prices.gasolina_aditivada}</Text>
                  </Text>
                )}
                {station.prices.etanol && (
                  <Text style={styles.priceItem}>
                    Etanol: <Text style={styles.priceValue}>R$ {station.prices.etanol}</Text>
                  </Text>
                )}
                {station.prices.diesel && (
                  <Text style={styles.priceItem}>
                    Diesel: <Text style={styles.priceValue}>R$ {station.prices.diesel}</Text>
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <X size={16} color={Colors.text.secondary} />
        </TouchableOpacity>
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success.text,
  },
  body: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: Colors.text.tertiary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  distance: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  lastVisit: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  pricesBox: {
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  pricesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  pricesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceItem: {
    fontSize: 12,
    color: Colors.text.tertiary,
    width: '48%',
  },
  priceValue: {
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
