import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Car } from 'lucide-react-native';
import { Colors } from '@/constants';

interface FeedFABProps {
  scale: Animated.AnimatedInterpolation<string | number>;
  onPress?: () => void;
}

export const FeedFAB: React.FC<FeedFABProps> = ({
  scale,
  onPress,
}) => {
  return (
    <Animated.View
      style={[
        styles.fabContainer,
        {
          transform: [{ scale }],
          opacity: scale,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
      >
        <Car size={24} color={Colors.background.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 88,
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
});
