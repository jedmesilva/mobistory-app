import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Camera } from 'lucide-react-native';
import { Colors } from '@/constants';

interface QuickCaptureFooterProps {
  onPress: () => void;
  creditsRemaining?: number;
}

export const QuickCaptureFooter: React.FC<QuickCaptureFooterProps> = ({
  onPress,
  creditsRemaining = 2,
}) => {
  return (
    <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <View style={styles.iconContainer}>
            <Zap size={24} color={Colors.text.primary} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Captura Rápida</Text>
              <View style={styles.iaBadge}>
                <Text style={styles.iaBadgeText}>IA</Text>
              </View>
            </View>
            <Text style={styles.description}>
              Tire uma foto e deixe a IA identificar os dados
            </Text>
            <Text style={styles.credits}>{creditsRemaining} grátis</Text>
          </View>
          <Camera size={20} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footer: {
    backgroundColor: Colors.text.primary,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  iaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
  },
  iaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  description: {
    fontSize: 14,
    color: '#d1d5db',
    marginTop: 2,
  },
  credits: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
