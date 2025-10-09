import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface StepHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  isSuccess?: boolean;
}

export const StepHeader = ({
  icon,
  title,
  subtitle,
  isSuccess = false,
}: StepHeaderProps) => {
  return (
    <View style={styles.stepHeader}>
      {icon && (
        <View style={[styles.stepIcon, isSuccess && styles.stepIconSuccess]}>
          {icon}
        </View>
      )}
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSubtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stepHeader: {
    alignItems: 'center',
    gap: 8,
  },
  stepIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepIconSuccess: {
    backgroundColor: Colors.success.DEFAULT,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
