import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Car, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants';

interface FeedHeaderProps {
  translateY: Animated.AnimatedInterpolation<string | number>;
  onSearchPress?: () => void;
  onVehiclePress?: () => void;
  onMessagePress?: () => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  translateY,
  onSearchPress,
  onVehiclePress,
  onMessagePress,
}) => {
  return (
    <Animated.View
      style={[
        styles.header,
        { transform: [{ translateY }] },
      ]}
    >
      <SafeAreaView edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onVehiclePress}
          >
            <Car size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={onSearchPress}
          >
            <Search size={20} color={Colors.text.tertiary} />
            <Text style={styles.searchPlaceholder}>Buscar...</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={onMessagePress}
          >
            <MessageCircle size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
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
    padding: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
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
});
