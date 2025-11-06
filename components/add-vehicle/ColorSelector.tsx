import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { Colors } from '@/constants';

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
  finishType?: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (colorId: string, data?: { colorId?: string; colorName?: string; finishType?: string }) => void;
}

const FINISH_TYPES = [
  { value: 'solid', label: 'Sólida' },
  { value: 'metallic', label: 'Metálica' },
  { value: 'pearlescent', label: 'Perolada' },
  { value: 'matte', label: 'Fosca' },
  { value: 'glossy', label: 'Brilhante' },
];

export const ColorSelector = ({ colors, selectedColor, onSelectColor }: ColorSelectorProps) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customColorName, setCustomColorName] = useState('');
  const [customFinishType, setCustomFinishType] = useState('solid');

  const handleColorPress = (color: ColorOption) => {
    if (color.id === 'custom') {
      setShowCustomModal(true);
    } else {
      onSelectColor(color.id, { colorId: color.id, colorName: color.label, finishType: color.finishType });
    }
  };

  const handleCustomColorSubmit = () => {
    if (customColorName.trim()) {
      onSelectColor('custom', {
        colorName: customColorName.trim(),
        finishType: customFinishType,
      });
      setShowCustomModal(false);
      setCustomColorName('');
      setCustomFinishType('solid');
    }
  };

  const handleCustomColorCancel = () => {
    setShowCustomModal(false);
    setCustomColorName('');
    setCustomFinishType('solid');
  };

  return (
    <View style={styles.colorSection}>
      <Text style={styles.colorLabel}>Cor do veículo</Text>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color.id}
            onPress={() => handleColorPress(color)}
            style={[
              styles.colorButton,
              selectedColor === color.id && styles.colorButtonActive,
            ]}
          >
            <View style={[
              styles.colorCircle,
              { backgroundColor: color.hex },
              color.id === 'custom' && styles.customColorCircle,
            ]}>
              {color.id === 'custom' && (
                <Text style={styles.plusIcon}>+</Text>
              )}
            </View>
            <Text style={styles.colorText}>{color.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Color Modal */}
      <Modal
        visible={showCustomModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCustomColorCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informar cor personalizada</Text>
            <Text style={styles.modalSubtitle}>
              Descreva a cor do veículo da forma mais detalhada possível
            </Text>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome da cor *</Text>
                <TextInput
                  style={styles.formInput}
                  value={customColorName}
                  onChangeText={setCustomColorName}
                  placeholder="Ex: Preto perolado, Azul marinho escuro"
                  placeholderTextColor={Colors.primary.lighter}
                  autoFocus
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Acabamento</Text>
                <View style={styles.finishTypeGrid}>
                  {FINISH_TYPES.map((finish) => (
                    <TouchableOpacity
                      key={finish.value}
                      onPress={() => setCustomFinishType(finish.value)}
                      style={[
                        styles.finishTypeButton,
                        customFinishType === finish.value && styles.finishTypeButtonActive,
                      ]}
                    >
                      <Text style={[
                        styles.finishTypeText,
                        customFinishType === finish.value && styles.finishTypeTextActive,
                      ]}>
                        {finish.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleCustomColorCancel}
                style={[styles.modalButton, styles.modalButtonCancel]}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCustomColorSubmit}
                style={[
                  styles.modalButton,
                  styles.modalButtonConfirm,
                  !customColorName.trim() && styles.modalButtonDisabled,
                ]}
                disabled={!customColorName.trim()}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  customColorCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  plusIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.DEFAULT,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary.light,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary.dark,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.primary.light,
    marginBottom: 24,
  },
  modalForm: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.light,
    marginBottom: 8,
  },
  formInput: {
    fontSize: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    color: Colors.primary.dark,
    backgroundColor: Colors.background.secondary,
  },
  finishTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  finishTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.secondary,
  },
  finishTypeButtonActive: {
    borderColor: Colors.primary.DEFAULT,
    backgroundColor: Colors.primary.lightest,
  },
  finishTypeText: {
    fontSize: 14,
    color: Colors.primary.light,
    fontWeight: '500',
  },
  finishTypeTextActive: {
    color: Colors.primary.DEFAULT,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  modalButtonConfirm: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  modalButtonDisabled: {
    backgroundColor: Colors.primary.lighter,
    opacity: 0.5,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
