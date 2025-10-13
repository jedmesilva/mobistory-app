import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Car, Plus } from 'lucide-react-native';
import { Colors } from '@/constants';

export interface Vehicle {
  id: number;
  name: string;
  plate: string;
  color: string;
  year: number;
  odometer: number;
  fuelType: string;
  status: 'active' | 'sold';
  lastEvent: string;
}

interface VehicleSelectorProps {
  visible: boolean;
  vehicles: Vehicle[];
  selectedVehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onClose: () => void;
  onAddVehicle?: () => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  visible,
  vehicles,
  selectedVehicle,
  onSelect,
  onClose,
  onAddVehicle,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Seus Veículos</Text>
            <Text style={styles.subtitle}>Selecione um veículo para visualizar</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Veículos */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {vehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              onPress={() => onSelect(vehicle)}
              style={[
                styles.vehicleCard,
                selectedVehicle.id === vehicle.id && styles.vehicleCardSelected,
              ]}
            >
              <View style={styles.vehicleCardContent}>
                <View style={styles.vehicleCardLeft}>
                  <View
                    style={[
                      styles.vehicleIcon,
                      vehicle.status === 'active'
                        ? styles.vehicleIconActive
                        : styles.vehicleIconInactive,
                    ]}
                  >
                    <Car size={20} color={Colors.text.white} />
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{vehicle.name}</Text>
                    <Text style={styles.vehicleDetails}>
                      {vehicle.plate} • {vehicle.color}
                    </Text>
                  </View>
                </View>
                <View style={styles.vehicleCardRight}>
                  <Text style={styles.vehicleOdometer}>
                    {vehicle.odometer.toLocaleString()} km
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      vehicle.status === 'active'
                        ? styles.statusBadgeActive
                        : styles.statusBadgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        vehicle.status === 'active'
                          ? styles.statusBadgeTextActive
                          : styles.statusBadgeTextInactive,
                      ]}
                    >
                      {vehicle.status === 'active' ? 'Ativo' : 'Vendido'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.vehicleStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Combustível</Text>
                  <Text style={styles.statValue}>{vehicle.fuelType}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Ano</Text>
                  <Text style={styles.statValue}>{vehicle.year}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Último evento</Text>
                  <Text style={styles.statValue}>{vehicle.lastEvent}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Adicionar Veículo */}
          <TouchableOpacity
            onPress={onAddVehicle}
            style={styles.addVehicleButton}
          >
            <Plus size={20} color={Colors.text.secondary} />
            <Text style={styles.addVehicleButtonText}>Adicionar Veículo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  vehicleCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.primary,
  },
  vehicleCardSelected: {
    borderColor: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
  },
  vehicleCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleIconActive: {
    backgroundColor: Colors.text.primary,
  },
  vehicleIconInactive: {
    backgroundColor: Colors.text.tertiary,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  vehicleCardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  vehicleOdometer: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  statusBadgeInactive: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.DEFAULT,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadgeTextActive: {
    color: '#16a34a',
  },
  statusBadgeTextInactive: {
    color: Colors.text.secondary,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.primary,
    marginTop: 4,
  },
  addVehicleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
});
