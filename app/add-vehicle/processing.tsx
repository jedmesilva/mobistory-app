import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { ProcessingState } from '@/components/add-vehicle';
import { StyleSheet } from 'react-native';

export default function ProcessingScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ProcessingState />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
});
