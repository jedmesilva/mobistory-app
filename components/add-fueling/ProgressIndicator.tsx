import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index < currentStep && styles.dotActive]}
        />
      ))}
      <Text style={styles.text}>
        {currentStep}/{totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border.dark,
  },
  dotActive: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  text: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
});
