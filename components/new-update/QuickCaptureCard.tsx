import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Zap, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

interface QuickCaptureCardProps {
  onPress?: () => void;
  creditsAvailable?: number;
}

export function QuickCaptureCard({
  onPress,
  creditsAvailable = 2
}: QuickCaptureCardProps) {
  return (
    <View style={styles.container}>
      {/* Header com ícone e texto */}
      <View style={styles.header}>
        {/* Ícone de Energy */}
        <View style={styles.iconContainer}>
          <Zap size={24} color="#1a1a1a" fill="#1a1a1a" />
        </View>

        {/* Texto */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Captura Rápida</Text>
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>com IA</Text>
            </LinearGradient>
          </View>
          <Text style={styles.description}>
            Tire uma foto e deixe a IA extrair todos os dados
          </Text>
          <Text style={styles.credits}>
            {creditsAvailable} {creditsAvailable === 1 ? 'captura grátis disponível' : 'capturas grátis disponíveis'}
          </Text>
        </View>
      </View>

      {/* Botão Capturar */}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Camera size={20} color="#1a1a1a" />
        <Text style={styles.buttonText}>Capturar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background.primary,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.background.primary,
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    lineHeight: 16,
  },
  credits: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4ade80',
    marginTop: 6,
  },
  button: {
    backgroundColor: Colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
});
