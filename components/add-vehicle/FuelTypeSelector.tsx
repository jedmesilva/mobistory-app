import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fuel, Zap, Leaf } from 'lucide-react-native';

export interface FuelTypeOption {
  id: string;
  label: string;
  icon?: 'fuel' | 'electric' | 'hybrid';
}

interface FuelTypeSelectorProps {
  fuelTypes: FuelTypeOption[];
  selectedFuelType: string;
  onSelectFuelType: (fuelTypeId: string) => void;
}

const getFuelIcon = (fuelId: string, iconType?: string) => {
  const iconColors: { [key: string]: string } = {
    gasoline: '#ef4444', // Vermelho
    ethanol: '#3b82f6',  // Azul
    diesel: '#f59e0b',   // Amarelo/Dourado
    flex: '#a855f7',     // Roxo
    electric: '#06b6d4', // Ciano (azul elétrico)
    hybrid: '#10b981',   // Verde
  };

  const color = iconColors[fuelId] || '#4b5563';

  switch (iconType) {
    case 'electric':
      return <Zap size={24} color={color} />;
    case 'hybrid':
      return <Leaf size={24} color={color} />;
    case 'fuel':
    default:
      return <Fuel size={24} color={color} />;
  }
};

export const FuelTypeSelector = ({
  fuelTypes,
  selectedFuelType,
  onSelectFuelType,
}: FuelTypeSelectorProps) => {
  return (
    <View style={styles.fuelTypeList}>
      {fuelTypes.map((fuel) => (
        <TouchableOpacity
          key={fuel.id}
          onPress={() => onSelectFuelType(fuel.id)}
          style={[
            styles.fuelTypeButton,
            selectedFuelType === fuel.id && styles.fuelTypeButtonActive,
          ]}
        >
          {getFuelIcon(fuel.id, fuel.icon)}
          <Text style={styles.fuelTypeText}>{fuel.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  fuelTypeList: {
    gap: 12,
  },
  fuelTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  fuelTypeButtonActive: {
    borderColor: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  fuelTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
});
