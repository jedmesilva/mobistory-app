import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Mic, Image } from 'lucide-react-native';
import { Colors } from '@/constants';

interface QuickCaptureButtonProps {
  onPress: () => void;
  label?: string;
}

export const QuickCaptureButton = ({
  onPress,
  label = "Captura Rápida"
}: QuickCaptureButtonProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Camera size={20} color={Colors.primary.dark} />
          <Text style={styles.separator}>ou</Text>
          <Mic size={20} color={Colors.primary.dark} />
          <Text style={styles.separator}>ou</Text>
          <Image size={20} color={Colors.primary.dark} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
    paddingHorizontal: 24,
    paddingTop: 16,
    // paddingBottom é aplicado dinamicamente via useSafeAreaInsets
  },
  button: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  separator: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
});
