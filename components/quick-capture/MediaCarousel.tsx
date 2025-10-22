import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import { Colors } from '@/constants';
import { MediaThumbnail } from './MediaThumbnail';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CapturedMedia {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  timestamp: number;
}

interface MediaCarouselProps {
  media: CapturedMedia[];
  currentMediaId?: string;
  onMediaPress: (media: CapturedMedia) => void;
  onMediaRemove: (mediaId: string) => void;
}

export function MediaCarousel({
  media,
  currentMediaId,
  onMediaPress,
  onMediaRemove,
}: MediaCarouselProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (media.length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const photoCount = media.filter(m => m.type === 'photo').length;
  const videoCount = media.filter(m => m.type === 'video').length;

  const getCountText = () => {
    const parts: string[] = [];
    if (photoCount > 0) parts.push(`${photoCount} ${photoCount === 1 ? 'foto' : 'fotos'}`);
    if (videoCount > 0) parts.push(`${videoCount} ${videoCount === 1 ? 'vídeo' : 'vídeos'}`);
    return parts.join(' e ');
  };

  return (
    <View style={styles.container}>
      {isExpanded ? (
        // Expanded State
        <View style={styles.expandedContainer}>
          {/* Horizontal Scrollable List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            {media.map((item) => (
              <MediaThumbnail
                key={item.id}
                media={item}
                onPress={() => onMediaPress(item)}
                onRemove={() => onMediaRemove(item.id)}
                isSelected={item.id === currentMediaId}
              />
            ))}
          </ScrollView>

          {/* Count Badge */}
          <TouchableOpacity
            onPress={toggleExpanded}
            style={styles.countBadge}
            activeOpacity={0.7}
          >
            <Camera size={16} color={Colors.background.primary} strokeWidth={2.5} />
            <Text style={styles.countText}>{media.length}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Collapsed State
        <TouchableOpacity
          onPress={toggleExpanded}
          style={styles.collapsedButton}
          activeOpacity={0.7}
        >
          <Camera size={18} color={Colors.background.primary} strokeWidth={2.5} />
          <Text style={styles.collapsedLabel}>{getCountText()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  // Expanded State
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
    marginLeft: 6,
  },
  // Collapsed State
  collapsedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  collapsedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
  },
});
