import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { ArrowLeft, X } from 'lucide-react-native';

interface ScreenHeaderProps {
  onPress: () => void;
  variant?: 'back' | 'close';
}

export function ScreenHeader({ onPress, variant = 'back' }: ScreenHeaderProps) {
  const Icon = variant === 'close' ? X : ArrowLeft;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon size={20} color={Colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
