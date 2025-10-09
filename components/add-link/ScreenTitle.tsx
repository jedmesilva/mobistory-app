import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface ScreenTitleProps {
  title: string;
  subtitle: string;
  vehicleName: string;
}

export function ScreenTitle({ title, subtitle, vehicleName }: ScreenTitleProps) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        {subtitle}{' '}
        <Text style={styles.vehicleName}>{vehicleName}</Text>
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  vehicleName: {
    fontWeight: '600',
    color: Colors.primary.dark,
  },
});
