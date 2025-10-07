import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export const ProcessingState = () => {
  return (
    <View style={styles.processingContainer}>
      <View style={styles.processingIcon}>
        <Sparkles size={32} color="#fff" />
      </View>
      <Text style={styles.processingTitle}>Identificando seu veículo...</Text>
      <Text style={styles.processingSubtitle}>
        Processando informações automaticamente
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  processingIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
