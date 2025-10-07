import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Camera, Mic, Upload, ChevronRight } from 'lucide-react-native';

interface CaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (method: 'camera' | 'voice' | 'gallery') => void;
  title: string;
  subtitle: string;
  disabled?: boolean;
}

export const CaptureModal = ({
  visible,
  onClose,
  onCapture,
  title,
  subtitle,
  disabled = false,
}: CaptureModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.content}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.body}>
            <TouchableOpacity
              onPress={() => onCapture('camera')}
              disabled={disabled}
              style={[styles.option, disabled && styles.optionDisabled]}
            >
              <View style={styles.optionIcon}>
                <Camera size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Tirar Foto</Text>
                <Text style={styles.optionSubtitle}>Fotografe o painel da bomba</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onCapture('voice')}
              disabled={disabled}
              style={[styles.option, disabled && styles.optionDisabled]}
            >
              <View style={styles.optionIcon}>
                <Mic size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Comando de Voz</Text>
                <Text style={styles.optionSubtitle}>Fale os valores</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onCapture('gallery')}
              disabled={disabled}
              style={[styles.option, disabled && styles.optionDisabled]}
            >
              <View style={styles.optionIcon}>
                <Upload size={24} color="#fff" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Enviar da Galeria</Text>
                <Text style={styles.optionSubtitle}>Selecione uma foto já tirada</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  body: {
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
});
