import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
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
        <Zap size={20} color={Colors.background.primary} />
      </View>
      <View style={styles.captureTextContainer}>
        <Text style={styles.captureTitle}>{title}</Text>
        {subtitle && <Text style={styles.captureSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color={Colors.text.placeholder} />
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
    borderBottomColor: Colors.background.tertiary,
  },
  captureIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary.DEFAULT,
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
    color: Colors.primary.dark,
  },
  captureSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
});
