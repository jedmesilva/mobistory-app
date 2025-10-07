import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    color: '#374151',
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
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  colorButtonActive: {
    borderColor: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
});
