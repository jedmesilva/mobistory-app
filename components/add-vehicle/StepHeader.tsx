import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepIconSuccess: {
    backgroundColor: '#10b981',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
