import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car } from 'lucide-react-native';
import { Colors } from '@/constants';

interface FeedFABProps {
  scale: Animated.AnimatedInterpolation<string | number>;
  onPress?: () => void;
  navBottomHeight?: number;
}

export const FeedFAB: React.FC<FeedFABProps> = React.memo(({
  scale,
  onPress,
  navBottomHeight = 0,
}) => {
  const insets = useSafeAreaInsets();

  // Calcula a posição: SafeArea bottom + altura do nav + margem
  const bottomPosition = insets.bottom + navBottomHeight + 16;

  return (
    <Animated.View
      style={[
        styles.fabContainer,
        {
          bottom: bottomPosition,
          transform: [{ scale }],
          opacity: scale,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        onPress={onPress}
      >
        <Car size={24} color={Colors.background.primary} />
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 20,
  },
  fab: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
  },
});
