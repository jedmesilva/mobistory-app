import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Car, Check } from 'lucide-react-native';
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
}

export const VehicleHeader = ({
  onBack,
  hasAutoData,
  vehicleData,
  colors,
  progress,
}: VehicleHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft size={24} color="#4b5563" />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        {hasAutoData ? (
          <View style={styles.headerComplete}>
            <View style={styles.headerIcon}>
              <Car size={20} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {vehicleData.brand} {vehicleData.model}
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {vehicleData.plate}
                {vehicleData.year && ` • ${vehicleData.year}`}
                {vehicleData.color &&
                  ` • ${colors.find((c) => c.id === vehicleData.color)?.label}`}
              </Text>
            </View>
            <Check size={32} color="#10b981" />
          </View>
        ) : (
          <View style={styles.headerProgress}>
            <View style={styles.headerIcon}>
              <Car size={20} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {vehicleData.brand
                  ? `${vehicleData.brand}${vehicleData.model ? ` ${vehicleData.model}` : ''}`
                  : 'Novo Veículo'}
              </Text>
              {(vehicleData.plate || vehicleData.year || vehicleData.color) && (
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {vehicleData.plate && vehicleData.plate}
                  {vehicleData.plate && vehicleData.year && ' • '}
                  {vehicleData.year && vehicleData.year}
                  {(vehicleData.plate || vehicleData.year) && vehicleData.color && ' • '}
                  {vehicleData.color &&
                    colors.find((c) => c.id === vehicleData.color)?.label}
                </Text>
              )}
            </View>
            <ProgressCircle progress={progress} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
