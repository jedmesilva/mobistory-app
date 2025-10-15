import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Car, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants';

interface FeedHeaderProps {
  translateY: Animated.AnimatedInterpolation<string | number>;
  opacity: Animated.AnimatedInterpolation<string | number>;
  onSearchPress?: () => void;
  onVehiclePress?: () => void;
  onMessagePress?: () => void;
  onLayout?: (height: number) => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  translateY,
  opacity,
  onSearchPress,
  onVehiclePress,
  onMessagePress,
  onLayout,
}) => {
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    onLayout?.(height);
  };

  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      onLayout={handleLayout}
    >
      <SafeAreaView edges={['top']}>
        <View style={styles.headerContent}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onVehiclePress}
          >
            <Car size={24} color={Colors.text.secondary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onSearchPress}
          >
            <Search size={20} color={Colors.text.tertiary} />
            <Text style={styles.searchPlaceholder}>Buscar...</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onMessagePress}
          >
            <MessageCircle size={24} color={Colors.text.secondary} />
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});
