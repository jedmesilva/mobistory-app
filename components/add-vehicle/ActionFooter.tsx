import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaptureButton } from '../ui/CaptureButton';

interface ActionFooterProps {
  hasAutoData: boolean;
  isProcessing: boolean;
  canProceed: boolean;
  isEditMode: boolean;
  currentStep: number;
  onShowCaptureModal: () => void;
  onSaveVehicle: () => void;
  onNext: () => void;
}

export const ActionFooter = ({
  hasAutoData,
  isProcessing,
  canProceed,
  isEditMode,
  currentStep,
  onShowCaptureModal,
  onSaveVehicle,
  onNext,
}: ActionFooterProps) => {
  return (
    <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
      <View style={styles.footer}>
        {!hasAutoData && !isProcessing && (
          <CaptureButton
            onPress={onShowCaptureModal}
            title="Captura Rápida"
            subtitle="Envie documento ou foto do veículo"
          />
        )}

        <View style={styles.footerActions}>
          {hasAutoData ? (
            <TouchableOpacity onPress={onSaveVehicle} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Confirmar e Cadastrar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onNext}
              disabled={!canProceed || isProcessing}
              style={[
                styles.primaryButton,
                (!canProceed || isProcessing) && styles.primaryButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  (!canProceed || isProcessing) && styles.primaryButtonTextDisabled,
                ]}
              >
                {isEditMode ? 'Salvar Alteração' : currentStep === 5 ? 'Revisar dados' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  footerActions: {
    padding: 16,
  },
  primaryButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  primaryButtonTextDisabled: {
    color: '#6b7280',
  },
});
