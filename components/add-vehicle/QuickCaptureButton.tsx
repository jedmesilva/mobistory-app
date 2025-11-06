import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Mic, Image, Zap } from 'lucide-react-native';
import { Colors } from '@/constants';

interface QuickCaptureButtonProps {
  onPress: () => void;
  label?: string;
  description?: string;
}

export const QuickCaptureButton = ({
  onPress,
  label = "Captura Rápida",
  description = "Identificar automaticamente"
}: QuickCaptureButtonProps) => {
  const insets = useSafeAreaInsets();
  const [iconIndex, setIconIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const icons = [
    { Icon: Camera, label: 'Camera' },
    { Icon: Mic, label: 'Mic' },
    { Icon: Image, label: 'Image' },
  ];

  const CurrentIcon = icons[iconIndex].Icon;

  // Rotaciona os ícones a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Muda o ícone
        setIconIndex((prev) => (prev + 1) % icons.length);
        // Fade in com bounce
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {/* Header do Card */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Zap size={20} color={Colors.primary.DEFAULT} fill={Colors.primary.DEFAULT} />
          <Text style={styles.headerTitle}>Captura Rápida</Text>
        </View>
        <View style={styles.usageBadge}>
          <Text style={styles.usageLabel}>Uso:</Text>
          <Text style={styles.usageValue}>10%</Text>
        </View>
      </View>

      {/* Botão Principal */}
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonLeft}>
            <Text style={styles.buttonTitle}>{label}</Text>
            <Text style={styles.buttonDescription}>{description}</Text>
          </View>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <CurrentIcon size={20} color="rgba(255, 255, 255, 0.7)" />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 2,
    borderTopColor: Colors.border.DEFAULT,
    paddingHorizontal: 24,
    paddingTop: 16,
    // paddingBottom é aplicado dinamicamente via useSafeAreaInsets
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  usageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  usageLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  usageValue: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    flex: 1,
    gap: 2,
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
