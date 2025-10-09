import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { ArrowLeft, Car, Check, X } from 'lucide-react-native';
import { ProgressCircle } from './ProgressCircle';
import { ColorOption } from './ColorSelector';

interface VehicleHeaderProps {
  onBack: () => void;
  hasAutoData: boolean;
  vehicleData: {
    brand: string;
    model: string;
    plate: string;
    year: string;
    color: string;
  };
  colors: ColorOption[];
  progress: number;
  isFirstStep?: boolean;
}

export const VehicleHeader = ({
  onBack,
  hasAutoData,
  vehicleData,
  colors,
  progress,
  isFirstStep = false,
}: VehicleHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        {isFirstStep ? (
          <X size={24} color={Colors.text.secondary} />
        ) : (
          <ArrowLeft size={24} color={Colors.text.secondary} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
});
