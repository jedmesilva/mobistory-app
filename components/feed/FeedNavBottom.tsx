import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Car } from 'lucide-react-native';
import { Colors } from '@/constants';

interface FeedNavBottomProps {
  translateY: Animated.AnimatedInterpolation<string | number>;
  activeTab: 'home' | 'profile';
  onTabChange: (tab: 'home' | 'profile') => void;
}

export const FeedNavBottom: React.FC<FeedNavBottomProps> = ({
  translateY,
  activeTab,
  onTabChange,
}) => {
  return (
    <Animated.View
      style={[
        styles.navBottom,
        { transform: [{ translateY }] },
      ]}
    >
      <SafeAreaView edges={['bottom']}>
        <View style={styles.navContent}>
          <TouchableOpacity
            onPress={() => onTabChange('home')}
            style={styles.navButton}
          >
            <Home
              size={24}
              color={
                activeTab === 'home'
                  ? Colors.text.primary
                  : Colors.text.tertiary
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onTabChange('profile')}
            style={styles.navButton}
          >
            <Car
              size={24}
              color={
                activeTab === 'profile'
                  ? Colors.text.primary
                  : Colors.text.tertiary
              }
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  navBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
    zIndex: 10,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
