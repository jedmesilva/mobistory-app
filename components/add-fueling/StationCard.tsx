import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { MapPin, Clock, Star } from 'lucide-react-native';

export interface Station {
  id: number;
  name: string;
  brand: string;
  address: string;
  distance: string;
  isFavorite: boolean;
  lastVisit?: string;
  isUserAdded?: boolean;
  prices?: {
    gasolina_comum?: string;
    gasolina_aditivada?: string;
    etanol?: string;
    diesel?: string;
  };
}

interface StationCardProps {
  station: Station;
  onPress: () => void;
  showPrice?: boolean;
}

export const StationCard = ({ station, onPress, showPrice = true }: StationCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
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
            <View style={styles.lastVisit}>
              <Clock size={12} color={Colors.text.placeholder} />
              <Text style={styles.lastVisitText}>
                Último: {new Date(station.lastVisit).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          )}
          {showPrice && station.prices?.gasolina_comum && (
            <Text style={styles.price}>Comum: R$ {station.prices.gasolina_comum}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
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
    justifyContent: 'space-between',
    gap: 12,
  },
  distance: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  lastVisit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastVisitText: {
    fontSize: 12,
    color: Colors.text.placeholder,
  },
  price: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
});
