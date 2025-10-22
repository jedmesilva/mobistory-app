import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { VehicleHeader, BackButton } from '@/components/ui';
import { ChatConversation } from '@/components/chat';
import { useConversation, useMessages } from '@/hooks/conversation';
import { useAuthEntity } from '@/contexts';

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp?: string;
  date: string;
  card?: any;
  hasImage?: boolean;
  data?: {
    liters?: number;
    price?: number;
    station?: string;
  };
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { entityId, loading: entityLoading } = useAuthEntity();

  // Get vehicle ID from params (passed as 'id')
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Fetch or create conversation (only when entityId is available)
  const { conversation, loading: conversationLoading, error: conversationError } = useConversation({
    vehicleId,
    entityId: entityId || undefined,
  });

  // Fetch messages for this conversation
  const { messages: dbMessages, loading: messagesLoading, sendMessage } = useMessages(conversation?.id);

  // Transform database messages to ChatMessage format
  const messages: ChatMessage[] = dbMessages.map((msg, index) => {
    const isBot = msg.sender.entity_type === 'ai_assistant';
    const timestamp = new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const date = new Date(msg.created_at).toISOString().split('T')[0];

    return {
      id: index + 1,
      type: isBot ? 'bot' : 'user',
      message: msg.content || '',
      timestamp,
      date,
    };
  });

  const handleSendMessage = async (messageText: string) => {
    if (conversation && entityId) {
      await sendMessage({
        conversationId: conversation.id,
        senderId: entityId,
        content: messageText,
        messageType: 'text',
      });
    }
  };

  const handleCameraPress = () => {
    router.push({
      pathname: '/quick-capture',
      params: {
        from: 'conversation',
        context: 'open',
        vehicleId,
      }
    });
  };

  // Loading state
  if (entityLoading || conversationLoading || messagesLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>
            {entityLoading ? 'Carregando usuário...' : 'Carregando conversa...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (conversationError || !conversation) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Erro ao carregar conversa</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonError}>
            <Text style={styles.backButtonErrorText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Extract vehicle info from conversation
  const vehicle = conversation.vehicles;
  const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0];
  const activeColor = vehicle.colors?.find(c => c.active) || vehicle.colors?.[0];
  const vehicleName = `${vehicle.brands.brand} ${vehicle.models.model}`;
  const vehicleDetails = `${activePlate?.plate || ''} • ${vehicle.model_year || ''}${activeColor?.color ? ` • ${activeColor.color}` : ''}`;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <SafeAreaView edges={['top']}>
        <VehicleHeader
          vehicleName={vehicleName}
          vehicleDetails={vehicleDetails}
          onVehiclePress={() => router.push({
            pathname: '/vehicle/linked',
            params: { vehicleId: vehicle.id }
          })}
          showChevron={false}
          showVehicleIcon={false}
          leftButton={<BackButton />}
        />
      </SafeAreaView>

      {/* Chat Conversation Component */}
      <ChatConversation
        messages={messages}
        onSendMessage={handleSendMessage}
        onCameraPress={handleCameraPress}
      />
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
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  backButtonError: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
  },
  backButtonErrorText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
  },
});
