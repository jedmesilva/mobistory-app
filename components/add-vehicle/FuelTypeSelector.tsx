import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
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
    gasoline: Colors.error.DEFAULT, // Vermelho
    ethanol: Colors.info.DEFAULT,  // Azul
    diesel: Colors.warning.DEFAULT,   // Amarelo/Dourado
    flex: Colors.fuel.flex,     // Roxo
    electric: Colors.fuel.electric, // Ciano (azul elétrico)
    hybrid: Colors.success.DEFAULT,   // Verde
  };

  const color = iconColors[fuelId] || Colors.text.secondary;

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
    borderColor: Colors.border.DEFAULT,
  },
  fuelTypeButtonActive: {
    borderColor: Colors.primary.DEFAULT,
    backgroundColor: Colors.background.secondary,
  },
  fuelTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
});
