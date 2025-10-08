import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, ChevronRight } from 'lucide-react-native';

interface CaptureButtonProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
}

export const CaptureButton = ({
  onPress,
  title = 'Captura Rápida',
  subtitle,
}: CaptureButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.captureButton}>
      <View style={styles.captureIcon}>
        <Zap size={20} color="#fff" />
      </View>
      <View style={styles.captureTextContainer}>
        <Text style={styles.captureTitle}>{title}</Text>
        {subtitle && <Text style={styles.captureSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  captureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  captureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  captureSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});
