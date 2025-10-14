import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Car, ChevronsUpDown } from 'lucide-react-native';
import { Colors } from '@/constants';

interface VehicleHeaderProps {
  vehicleName: string;
  vehicleDetails: string;
  onVehiclePress?: () => void;
  rightButton?: ReactNode;
  leftButton?: ReactNode;
  showChevron?: boolean;
  showVehicleIcon?: boolean;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({
  vehicleName,
  vehicleDetails,
  onVehiclePress,
  rightButton,
  leftButton,
  showChevron = true,
  showVehicleIcon = true,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {leftButton && (
        <View style={styles.leftButtonContainer}>
          {leftButton}
        </View>
      )}

      <TouchableOpacity
        style={styles.headerVehicle}
        onPress={onVehiclePress}
        disabled={!onVehiclePress}
      >
        {showVehicleIcon && (
          <View style={styles.headerVehicleIcon}>
            <Car size={24} color={Colors.text.secondary} />
          </View>
        )}
        <View style={styles.headerVehicleInfo}>
          <View style={styles.headerVehicleName}>
            <Text style={styles.headerVehicleNameText}>{vehicleName}</Text>
            {showChevron && onVehiclePress && (
              <ChevronsUpDown size={20} color={Colors.text.secondary} />
            )}
          </View>
          <Text style={styles.headerVehicleDetails}>{vehicleDetails}</Text>
        </View>
      </TouchableOpacity>

      {rightButton}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.primary,
  },
  leftButtonContainer: {
    marginRight: 12,
  },
  headerVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerVehicleIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerVehicleInfo: {
    flex: 1,
  },
  headerVehicleName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerVehicleNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerVehicleDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});
