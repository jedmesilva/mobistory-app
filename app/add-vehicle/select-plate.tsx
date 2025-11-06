import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gauge } from 'lucide-react-native';
import { Colors } from '@/constants';
import {
  StepHeader,
  VehicleHeader,
  QuickCaptureButton,
} from '@/components/add-vehicle';
import { usePlateTypes } from '@/lib/api/hooks';
import type { VehicleData } from './index';

interface SelectPlateScreenProps {
  onPlateSelected: (plateTypeId: string, plateNumber: string) => void;
  onBack: () => void;
  onShowCaptureModal: () => void;
}

export default function SelectPlateScreen({
  onPlateSelected,
  onBack,
  onShowCaptureModal,
}: SelectPlateScreenProps) {
  const [selectedPlateType, setSelectedPlateType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  // Buscar tipos de placa do backend (apenas Brasil por enquanto)
  const { plateTypes, loading, error } = usePlateTypes({ country: 'BR' });

  const handleSubmit = () => {
    if (selectedPlateType && plateNumber.trim()) {
      onPlateSelected(selectedPlateType, plateNumber);
    }
  };

  const canProceed = selectedPlateType && plateNumber.trim().length >= 7;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <VehicleHeader
          onBack={onBack}
          hasAutoData={false}
          vehicleData={{} as any}
          colors={[]}
          progress={(5 / 8) * 100}
          isFirstStep={false}
        />

        <View style={styles.stepContainer}>
          <StepHeader
            icon={<Gauge size={32} color={Colors.background.primary} />}
            title="Placa do Veículo"
            subtitle="Selecione o tipo e informe o número"
          />

          {/* Tipo de Placa */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tipo de Placa</Text>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
                <Text style={styles.loadingText}>Carregando tipos de placa...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.plateTypesGrid}>
                {plateTypes.map((plateType) => (
                  <TouchableOpacity
                    key={plateType.id}
                    style={[
                      styles.plateTypeCard,
                      selectedPlateType === plateType.id && styles.plateTypeCardSelected,
                    ]}
                    onPress={() => setSelectedPlateType(plateType.id)}
                  >
                    <Text
                      style={[
                        styles.plateTypeName,
                        selectedPlateType === plateType.id && styles.plateTypeNameSelected,
                      ]}
                    >
                      {plateType.name}
                    </Text>
                    <Text
                      style={[
                        styles.plateTypeColor,
                        selectedPlateType === plateType.id && styles.plateTypeColorSelected,
                      ]}
                    >
                      {plateType.plate_color_name || plateType.description || ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Número da Placa */}
          {selectedPlateType && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Número da Placa</Text>
              <View style={styles.plateInputContainer}>
                <Text style={styles.plateInput}>{plateNumber || 'ABC-1234'}</Text>
              </View>
              <Text style={styles.inputHint}>
                Digite o número da placa (sem espaços ou hífens)
              </Text>
            </View>
          )}

          {/* Botão Continuar */}
          {canProceed && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSubmit}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Capturar Placa"
        description="Identificar tipo e número da placa"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  stepContainer: {
    gap: 24,
    padding: 24,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  plateTypesGrid: {
    gap: 12,
  },
  plateTypeCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.secondary,
  },
  plateTypeCardSelected: {
    borderColor: Colors.primary.DEFAULT,
    backgroundColor: Colors.primary.light,
  },
  plateTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  plateTypeNameSelected: {
    color: Colors.primary.dark,
  },
  plateTypeColor: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  plateTypeColorSelected: {
    color: Colors.primary.DEFAULT,
  },
  plateInputContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    padding: 20,
    alignItems: 'center',
  },
  plateInput: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 4,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
});
