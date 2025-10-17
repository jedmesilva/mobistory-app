import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Car, ChevronRight, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants';
import { SimpleHeader } from '@/components/ui';
import { useConversations } from '@/hooks/conversation';
import { useAuthEntity } from '@/contexts';

export default function ConversationsScreen() {
  const router = useRouter();
  const { entityId, loading: entityLoading } = useAuthEntity();
  const { conversations, loading: conversationsLoading } = useConversations(entityId);

  // Transform conversations to display format
  const conversationsList = useMemo(() => {
    return conversations.map((conversation) => {
      const vehicle = conversation.vehicles;
      const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0];
      const activeColor = vehicle.colors?.find(c => c.active) || vehicle.colors?.[0];

      return {
        id: conversation.id,
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brands.brand} ${vehicle.models.model}`,
        vehicleModel: vehicle.model_versions?.version || '',
        plate: activePlate?.plate || '',
        year: vehicle.model_year || 0,
        color: activeColor?.color || '',
        lastMessage: conversation.last_message_preview || 'Sem mensagens',
        lastMessageTime: conversation.last_message_at
          ? formatTime(conversation.last_message_at)
          : '',
        unreadCount: conversation.unread_count,
      };
    });
  }, [conversations]);

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  const handleConversationPress = (vehicleId: string) => {
    router.push({
      pathname: '/conversations/[id]',
      params: {
        id: vehicleId,
      }
    });
  };

  // Loading state
  if (entityLoading || conversationsLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <SimpleHeader title="Conversas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Carregando conversas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <SimpleHeader title="Conversas" />

      {/* Lista de Conversas */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {conversationsList.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <MessageCircle size={48} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma conversa</Text>
            <Text style={styles.emptyStateSubtitle}>
              Você ainda não tem conversas com veículos.{'\n'}
              Acesse o perfil de um veículo e inicie uma conversa.
            </Text>
          </View>
        ) : (
          /* Lista de Conversas */
          <View style={styles.conversationsList}>
            {conversationsList.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationCard}
                onPress={() => handleConversationPress(conversation.vehicleId)}
                activeOpacity={0.7}
              >
                <View style={styles.conversationCardLeft}>
                  <View style={styles.vehicleIcon}>
                    <Car size={24} color={Colors.text.secondary} />
                  </View>

                  <View style={styles.conversationInfo}>
                    <View style={styles.conversationHeader}>
                      <Text style={styles.vehicleName} numberOfLines={1}>
                        {conversation.vehicleName}
                      </Text>
                      {conversation.lastMessageTime && (
                        <Text style={styles.lastMessageTime}>
                          {conversation.lastMessageTime}
                        </Text>
                      )}
                    </View>

                    <View style={styles.conversationFooter}>
                      <Text
                        style={styles.lastMessage}
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>
                      {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>
                            {conversation.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    backgroundColor: Colors.background.secondary,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  conversationsList: {
    padding: 16,
    gap: 0,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  conversationCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.secondary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  lastMessageTime: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.background.primary,
  },
});
