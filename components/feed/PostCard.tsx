import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image as RNImage,
  Modal,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Car,
  Fuel,
  UserCheck,
  Image,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants';
import { OdometerIcon } from '../icons';

interface PostTag {
  icon: 'odometer' | 'fuel' | 'userCheck';
  label: string;
  value: string;
}

interface Post {
  id: number;
  type: 'image' | 'video';
  userName: string;
  userRole: string;
  vehicleId?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  vehicleColor?: string;
  vehicleImageUrl?: string;
  date: string;
  caption?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  following: boolean;
  tags?: PostTag[];
}

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = React.memo(({ post }) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [following, setFollowing] = useState(post.following || false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
  };

  const handleVehiclePress = () => {
    if (post.vehicleId) {
      router.push({
        pathname: '/vehicle-profile',
        params: {
          vehicleId: post.vehicleId,
        }
      });
    }
  };

  const renderIcon = (iconType: string, size: number = 16) => {
    const iconColor = Colors.text.tertiary;

    switch (iconType) {
      case 'odometer':
        return <OdometerIcon size={size} color={iconColor} />;
      case 'fuel':
        return <Fuel size={size} color={iconColor} />;
      case 'userCheck':
        return <UserCheck size={size} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagem/Vídeo */}
      <View style={styles.mediaContainer}>
        {post.imageUrl ? (
          <RNImage
            source={{ uri: post.imageUrl }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ) : (
          <Image size={48} color={Colors.text.tertiary} style={styles.mediaPlaceholder} />
        )}
        <View style={styles.mediaTypeBadge}>
          <Text style={styles.mediaTypeText}>
            {post.type === 'image' ? 'Imagem' : 'Vídeo'}
          </Text>
        </View>
      </View>

      {/* Barra de Ações */}
      <View style={styles.actionsBar}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Heart
              size={24}
              color={liked ? Colors.error.DEFAULT : Colors.text.secondary}
              fill={liked ? Colors.error.DEFAULT : 'none'}
            />
            <Text style={styles.actionText}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={24} color={Colors.text.secondary} fill="none" />
            <Text style={styles.actionText}>{post.comments || 0}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Cabeçalho com Veículo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={handleVehiclePress}
          activeOpacity={0.7}
        >
          <View style={styles.vehicleAvatar}>
            {post.vehicleImageUrl ? (
              <ExpoImage
                source={{ uri: post.vehicleImageUrl }}
                style={styles.vehicleAvatarImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <Car size={20} color={Colors.text.tertiary} />
            )}
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{post.vehicleName || 'Honda Civic XLI'}</Text>
            <Text style={styles.vehicleDetails}>
              {post.vehiclePlate || 'ABC-1234'}{post.vehicleColor ? ` • ${post.vehicleColor}` : ''}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFollow} style={[
          styles.followButton,
          following && styles.followButtonActive
        ]}>
          <Text style={[
            styles.followButtonText,
            following && styles.followButtonTextActive
          ]}>
            {following ? 'Seguindo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Identificação do Usuário e Descrição */}
      <View style={styles.content}>
        <View style={styles.userRow}>
          <Text style={styles.userName}>
            Por {post.userName}
            <Text style={styles.userRole}> • {post.userRole}</Text>
          </Text>
          <View style={styles.userActions}>
            <Text style={styles.date}>{post.date}</Text>
            <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
              <MoreVertical size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {post.caption && (
          <Text style={styles.caption}>{post.caption}</Text>
        )}
      </View>

      {/* Tags de Informações do Veículo */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <View style={styles.tagsCard}>
            <Text style={styles.tagsTitle}>Marcos do veículo</Text>
            <View style={styles.tagsList}>
              {post.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  {renderIcon(tag.icon)}
                  <Text style={styles.tagLabel}>
                    {tag.label}: <Text style={styles.tagValue}>{tag.value}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Ocultar publicação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Deixar de seguir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                Denunciar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 32,
    marginBottom: 32,
  },
  mediaContainer: {
    width: '100%',
    height: 256,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    opacity: 0.3,
  },
  mediaTypeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mediaTypeText: {
    color: Colors.background.primary,
    fontSize: 12,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  shareButton: {
    padding: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleAvatar: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  vehicleAvatarImage: {
    width: '100%',
    height: '100%',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  vehicleDetails: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  followButton: {
    backgroundColor: Colors.primary.DEFAULT,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  followButtonActive: {
    backgroundColor: Colors.background.tertiary,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.background.primary,
  },
  followButtonTextActive: {
    color: Colors.text.secondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  userRole: {
    fontWeight: '400',
    color: Colors.text.tertiary,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  menuButton: {
    padding: 4,
  },
  caption: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  tagsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tagsCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  tagsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagsList: {
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  tagValue: {
    fontWeight: '500',
    color: Colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    width: 240,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  menuItemTextDanger: {
    color: Colors.error.DEFAULT,
  },
});
