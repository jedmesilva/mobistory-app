import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Fuel, Wrench, AlertTriangle, Link, X } from 'lucide-react-native';

interface MoreOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (type: string) => void;
}

export const MoreOptionsModal = ({ visible, onClose, onOptionSelect }: MoreOptionsModalProps) => {
  const options = [
    {
      id: 'fuel',
      icon: Fuel,
      label: 'Abastecimento',
      description: 'Registrar novo abastecimento',
      color: '#3b82f6',
    },
    {
      id: 'maintenance',
      icon: Wrench,
      label: 'Manutenção',
      description: 'Adicionar serviço ou reparo',
      color: '#10b981',
    },
    {
      id: 'alert',
      icon: AlertTriangle,
      label: 'Alerta',
      description: 'Registrar problema ou aviso',
      color: '#f59e0b',
    },
    {
      id: 'link',
      icon: Link,
      label: 'Vínculo',
      description: 'Gerenciar vínculo do veículo',
      color: '#8b5cf6',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Evento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.options}>
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionButton}
                  onPress={() => {
                    onOptionSelect(option.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                    <IconComponent size={24} color="#fff" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});
