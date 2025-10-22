import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { X, Play } from 'lucide-react-native';
import { Colors } from '@/constants';

const { width } = Dimensions.get('window');

interface CapturedMedia {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  timestamp: number;
}

interface MediaThumbnailProps {
  media: CapturedMedia;
  onPress: () => void;
  onRemove: () => void;
  isSelected?: boolean;
}

export function MediaThumbnail({
  media,
  onPress,
  onRemove,
  isSelected = false,
}: MediaThumbnailProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, isSelected && styles.containerSelected]}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      {media.type === 'photo' ? (
        <Image source={{ uri: media.uri }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: media.uri }}
            style={styles.thumbnail}
            resizeMode="cover"
            shouldPlay={false}
          />
          <View style={styles.playIconContainer}>
            <Play size={16} color={Colors.background.primary} fill={Colors.background.primary} />
          </View>
        </View>
      )}

      {/* Remove Button */}
      <TouchableOpacity
        onPress={onRemove}
        style={styles.removeButton}
        activeOpacity={0.7}
      >
        <X size={12} color={Colors.background.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: Colors.primary.DEFAULT,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  removeButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
