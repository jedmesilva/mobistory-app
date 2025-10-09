import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import {
  X,
  User,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export function MenuModal({ visible, onClose, onNavigate }: MenuModalProps) {
  const menuItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Meu Perfil',
      description: 'Informações pessoais e preferências',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Configurações',
      description: 'Notificações e privacidade',
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Ajuda e Suporte',
      description: 'Central de ajuda e FAQ',
    },
    {
      id: 'terms',
      icon: FileText,
      label: 'Termos de Uso',
      description: 'Políticas e termos',
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'Privacidade',
      description: 'Como protegemos seus dados',
    },
  ];

  const handleItemPress = (id: string) => {
    onClose();
    onNavigate(id);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.overlayBackground} />
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Menu</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={24} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* User Info */}
                <View style={styles.userSection}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>JS</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>João Silva</Text>
                    <Text style={styles.userEmail}>joao.silva@email.com</Text>
                  </View>
                </View>

                {/* Menu Items */}
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.menuList}>
                    {menuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleItemPress(item.id)}
                          style={styles.menuItem}
                        >
                          <View style={styles.menuItemIcon}>
                            <IconComponent size={20} color={Colors.text.secondary} />
                          </View>
                          <View style={styles.menuItemContent}>
                            <Text style={styles.menuItemLabel}>{item.label}</Text>
                            <Text style={styles.menuItemDescription}>
                              {item.description}
                            </Text>
                          </View>
                          <ChevronRight size={20} color={Colors.text.placeholder} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Logout */}
                  <TouchableOpacity
                    onPress={() => handleItemPress('logout')}
                    style={styles.logoutButton}
                  >
                    <LogOut size={20} color={Colors.error.dark} />
                    <Text style={styles.logoutButtonText}>Sair da Conta</Text>
                  </TouchableOpacity>

                  {/* App Version */}
                  <Text style={styles.versionText}>Versão 1.0.0</Text>
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      );
    }

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayBackground: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.background.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  menuList: {
    padding: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    gap: 12,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error.dark,
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: 16,
  },
});
