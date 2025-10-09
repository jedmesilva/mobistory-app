import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  UserPlus,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react-native';

type NotificationType = 'link_request' | 'link_approved' | 'document_expiring' | 'activity' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  vehicleName?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'link_request',
      title: 'Nova solicitação de vínculo',
      message: 'João Silva solicitou acesso como Condutor ao Honda Civic',
      timestamp: 'Há 2 horas',
      read: false,
      actionLabel: 'Revisar',
      vehicleName: 'Honda Civic',
    },
    {
      id: '2',
      type: 'link_approved',
      title: 'Vínculo aprovado',
      message: 'Seu vínculo com o Toyota Corolla foi aprovado',
      timestamp: 'Há 5 horas',
      read: false,
      vehicleName: 'Toyota Corolla',
    },
    {
      id: '3',
      type: 'document_expiring',
      title: 'Documento expirando',
      message: 'O IPVA do Volkswagen Gol vence em 7 dias',
      timestamp: 'Ontem',
      read: true,
      vehicleName: 'Volkswagen Gol',
    },
    {
      id: '4',
      type: 'activity',
      title: 'Novo abastecimento',
      message: 'Maria Santos registrou um abastecimento no Ford Ka',
      timestamp: 'Há 2 dias',
      read: true,
      vehicleName: 'Ford Ka',
    },
    {
      id: '5',
      type: 'system',
      title: 'Atualização disponível',
      message: 'Nova versão do app com melhorias de desempenho',
      timestamp: 'Há 3 dias',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'link_request':
        return UserPlus;
      case 'link_approved':
        return CheckCheck;
      case 'document_expiring':
        return AlertCircle;
      case 'activity':
        return FileText;
      case 'system':
        return Bell;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case 'link_request':
        return Colors.primary.dark;
      case 'link_approved':
        return Colors.success.dark;
      case 'document_expiring':
        return '#d97706';
      case 'activity':
        return '#3b82f6';
      case 'system':
        return Colors.text.secondary;
      default:
        return Colors.text.secondary;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.type === 'link_request' && notification.vehicleName) {
      // Would navigate to pending requests screen
    } else if (notification.vehicleName) {
      // Would navigate to vehicle details
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notificações</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <CheckCheck size={18} color={Colors.primary.dark} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Bell size={48} color={Colors.text.placeholder} />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
              <Text style={styles.emptySubtitle}>
                Você está em dia! Quando houver novidades, elas aparecerão aqui.
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getIconColor(notification.type);

                return (
                  <TouchableOpacity
                    key={notification.id}
                    onPress={() => handleNotificationPress(notification)}
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.notificationCardUnread,
                    ]}
                  >
                    <View
                      style={[
                        styles.notificationIcon,
                        !notification.read && styles.notificationIconUnread,
                      ]}
                    >
                      <IconComponent size={20} color={iconColor} />
                    </View>

                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text
                          style={[
                            styles.notificationTitle,
                            !notification.read && styles.notificationTitleUnread,
                          ]}
                        >
                          {notification.title}
                        </Text>
                        {!notification.read && <View style={styles.unreadDot} />}
                      </View>

                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>

                      <View style={styles.notificationFooter}>
                        <Clock size={12} color={Colors.text.tertiary} />
                        <Text style={styles.notificationTime}>
                          {notification.timestamp}
                        </Text>
                      </View>

                      {notification.actionLabel && !notification.read && (
                        <TouchableOpacity style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>
                            {notification.actionLabel}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  unreadBadge: {
    backgroundColor: Colors.primary.dark,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.background.primary,
  },
  markAllButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    gap: 12,
  },
  notificationCardUnread: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.primary.DEFAULT,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIconUnread: {
    backgroundColor: Colors.background.primary,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  notificationTitleUnread: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.dark,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  actionButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary.dark,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
  },
});
