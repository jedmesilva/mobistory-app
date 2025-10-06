import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Fuel, Gauge, Plus, Camera, FileText } from 'lucide-react-native';
import { OdometerIcon, FuelTankIcon } from '../icons';

interface MoreOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (type: string) => void;
}

export const MoreOptionsModal = ({ visible, onClose, onOptionSelect }: MoreOptionsModalProps) => {
  const eventOptions = [
    {
      id: 'km',
      icon: OdometerIcon,
      label: 'Registrar KM',
      description: 'Atualizar quilometragem atual',
    },
    {
      id: 'combustivel',
      icon: Fuel,
      label: 'Abastecimento',
      description: 'Registrar novo abastecimento',
    },
    {
      id: 'tanque',
      icon: FuelTankIcon,
      label: 'Nível do Tanque',
      description: 'Atualizar nível do combustível',
    },
    {
      id: 'pneus',
      icon: Gauge,
      label: 'Pneus',
      description: 'Atualizar calibragem dos pneus',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Registrar Evento</Text>
              <Text style={styles.subtitle}>Selecione o tipo de evento</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Plus size={20} color="#6b7280" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            {eventOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.gridItem}
                  onPress={() => {
                    onOptionSelect(option.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <IconComponent size={20} color="#4b5563" />
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                onOptionSelect('camera');
                onClose();
              }}
            >
              <Camera size={16} color="#fff" />
              <Text style={styles.cameraButtonText}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.importButton}
              onPress={() => {
                onOptionSelect('import');
                onClose();
              }}
            >
              <FileText size={16} color="#374151" />
              <Text style={styles.importButtonText}>Importar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    borderRadius: 12,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  importButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  importButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});
