import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Image, MessageCircle, MoreVertical, Fuel, UserCheck, Share2, Heart } from 'lucide-react-native';
import { Colors } from '@/constants';
import { OdometerIcon } from '@/components/icons';

interface MomentTag {
  icon: 'odometer' | 'fuel' | 'userCheck';
  label: string;
  value: string;
}

interface Moment {
  id: number;
  type: 'image' | 'video';
  userName: string;
  userRole: string;
  date: string;
  caption?: string;
  likes: number;
  comments: number;
  tags?: MomentTag[];
}

interface MomentCardProps {
  moment: Moment;
}

export const MomentCard: React.FC<MomentCardProps> = ({ moment }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(moment.likes || 0);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'odometer':
        return <OdometerIcon size={16} color={Colors.text.secondary} />;
      case 'fuel':
        return <Fuel size={16} color={Colors.text.secondary} />;
      case 'userCheck':
        return <UserCheck size={16} color={Colors.text.secondary} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagem/Vídeo */}
      <View style={styles.mediaContainer}>
        <Image size={48} color={Colors.text.tertiary} />
        <View style={styles.mediaTypeBadge}>
          <Text style={styles.mediaTypeBadgeText}>
            {moment.type === 'image' ? 'Imagem' : 'Vídeo'}
          </Text>
        </View>
      </View>

      {/* Barra de Ações */}
      <View style={styles.actionsBar}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Heart
              size={24}
              color={liked ? '#ef4444' : Colors.text.secondary}
              fill={liked ? '#ef4444' : 'none'}
            />
            <Text style={styles.actionText}>{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={24} color={Colors.text.secondary} />
            <Text style={styles.actionText}>{moment.comments || 0}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Identificação do Usuário e Descrição */}
      <View style={styles.userSection}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>
            Por <Text style={styles.userNameBold}>{moment.userName}</Text>
            <Text style={styles.userRole}> • {moment.userRole}</Text>
          </Text>
          <View style={styles.userActions}>
            <Text style={styles.date}>{moment.date}</Text>
            <TouchableOpacity
              onPress={() => setShowMenu(true)}
              style={styles.menuButton}
            >
              <MoreVertical size={16} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {moment.caption && (
          <Text style={styles.caption}>{moment.caption}</Text>
        )}
      </View>

      {/* Tags de Informações do Veículo */}
      {moment.tags && moment.tags.length > 0 && (
        <View style={styles.tagsSection}>
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>MARCOS DO VEÍCULO</Text>
            <View style={styles.tagsList}>
              {moment.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagItem}>
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
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                Denunciar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 32,
    marginBottom: 32,
  },
  mediaContainer: {
    width: '100%',
    height: 256,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  mediaTypeBadgeText: {
    color: Colors.text.white,
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
    color: Colors.text.primary,
  },
  shareButton: {
    padding: 6,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
  },
  userSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  userNameBold: {
    fontWeight: '600',
  },
  userRole: {
    color: Colors.text.secondary,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  menuButton: {
    padding: 4,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
  },
  caption: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  tagsSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tagsContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  tagsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagsList: {
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  tagValue: {
    fontWeight: '600',
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
    width: '80%',
    maxWidth: 320,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  menuItemDanger: {
    color: Colors.error.DEFAULT,
  },
});
