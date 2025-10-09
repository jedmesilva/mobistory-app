import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { Camera, Mic, Image, ChevronRight } from 'lucide-react-native';

interface CaptureOption {
  camera: string;
  voice: string;
  gallery: string;
}

interface SmartCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (method: 'camera' | 'voice' | 'gallery') => void;
  title: string;
  subtitle: string;
  options: CaptureOption;
  disabled?: boolean;
}

export const SmartCaptureModal = ({
  visible,
  onClose,
  onCapture,
  title,
  subtitle,
  options,
  disabled = false,
}: SmartCaptureModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

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
                <Camera size={24} color={Colors.background.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Tirar Foto</Text>
                <Text style={styles.optionSubtitle}>{options.camera}</Text>
              </View>
              <ChevronRight size={20} color={Colors.text.placeholder} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onCapture('voice')}
              disabled={disabled}
              style={[styles.option, disabled && styles.optionDisabled]}
            >
              <View style={styles.optionIcon}>
                <Mic size={24} color={Colors.background.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Comando de Voz</Text>
                <Text style={styles.optionSubtitle}>{options.voice}</Text>
              </View>
              <ChevronRight size={20} color={Colors.text.placeholder} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onCapture('gallery')}
              disabled={disabled}
              style={[styles.option, disabled && styles.optionDisabled]}
            >
              <View style={styles.optionIcon}>
                <Image size={24} color={Colors.background.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Enviar da Galeria</Text>
                <Text style={styles.optionSubtitle}>{options.gallery}</Text>
              </View>
              <ChevronRight size={20} color={Colors.text.placeholder} />
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
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: Colors.border.dark,
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
    color: Colors.primary.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
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
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.dark,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
});
