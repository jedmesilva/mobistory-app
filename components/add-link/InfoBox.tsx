import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface InfoBoxProps {
  children: React.ReactNode;
}

export function InfoBox({ children }: InfoBoxProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    padding: 12,
  },
  text: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});
