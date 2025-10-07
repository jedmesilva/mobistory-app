import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { StepHeader } from './StepHeader';
import { ConfirmationField } from './ConfirmationField';
import { ColorOption } from './ColorSelector';
import { FuelTypeOption } from './FuelTypeSelector';

interface VehicleData {
  brand: string;
  model: string;
  name: string;
  year: string;
  plate: string;
  color: string;
  fuelType: string;
}

interface ConfirmationScreenProps {
  vehicleData: VehicleData;
  colors: ColorOption[];
  fuelTypes: FuelTypeOption[];
  onEdit: (step: number) => void;
}

export const ConfirmationScreen = ({
  vehicleData,
  colors,
  fuelTypes,
  onEdit,
}: ConfirmationScreenProps) => {
  return (
    <View style={styles.confirmationContainer}>
      <StepHeader
        icon={<Check size={32} color="#fff" />}
        title="Confirme os dados do veículo"
        subtitle="Revise e edite se necessário"
        isSuccess
      />

      <View style={styles.confirmationCard}>
        <ConfirmationField
          label="Marca"
          value={vehicleData.brand}
          onEdit={() => onEdit(0)}
        />

        <ConfirmationField
          label="Modelo"
          value={vehicleData.model}
          onEdit={() => onEdit(1)}
        />

        <ConfirmationField
          label="Versão"
          value={vehicleData.name}
          onEdit={() => onEdit(2)}
        />

        <View style={styles.confirmationRow}>
          <ConfirmationField
            label="Ano"
            value={vehicleData.year}
            onEdit={() => onEdit(3)}
            isHalf
          />

          <ConfirmationField
            label="Placa"
            value={vehicleData.plate}
            onEdit={() => onEdit(4)}
            isHalf
          />
        </View>

        <View style={styles.confirmationRow}>
          <ConfirmationField
            label="Cor"
            value={colors.find((c) => c.id === vehicleData.color)?.label || ''}
            onEdit={() => onEdit(4)}
            isHalf
            renderValue={() => (
              <View style={styles.confirmationColorRow}>
                <View
                  style={[
                    styles.confirmationColorCircle,
                    {
                      backgroundColor: colors.find(
                        (c) => c.id === vehicleData.color
                      )?.hex,
                    },
                  ]}
                />
                <Text style={styles.confirmationValue}>
                  {colors.find((c) => c.id === vehicleData.color)?.label}
                </Text>
              </View>
            )}
          />

          <ConfirmationField
            label="Combustível"
            value={fuelTypes.find((f) => f.id === vehicleData.fuelType)?.label || ''}
            onEdit={() => onEdit(5)}
            isHalf
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  confirmationContainer: {
    gap: 24,
  },
  confirmationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  confirmationRow: {
    flexDirection: 'row',
    gap: 16,
  },
  confirmationColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  confirmationColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
});
