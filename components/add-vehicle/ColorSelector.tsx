import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (colorId: string) => void;
}

export const ColorSelector = ({ colors, selectedColor, onSelectColor }: ColorSelectorProps) => {
  return (
    <View style={styles.colorSection}>
      <Text style={styles.colorLabel}>Cor do veículo</Text>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color.id}
            onPress={() => onSelectColor(color.id)}
            style={[
              styles.colorButton,
              selectedColor === color.id && styles.colorButtonActive,
            ]}
          >
            <View style={[styles.colorCircle, { backgroundColor: color.hex }]} />
            <Text style={styles.colorText}>{color.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colorSection: {
    gap: 12,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.light,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: '22%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    alignItems: 'center',
  },
  colorButtonActive: {
    borderColor: Colors.primary.DEFAULT,
    backgroundColor: Colors.background.secondary,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 4,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.light,
  },
});
