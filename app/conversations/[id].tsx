import React, { useState } from 'react';
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
import { VehicleHeader, BackButton, NewUpdateModal } from '@/components/ui';
import { ChatConversation } from '@/components/chat';
import { useConversation, useMessages } from '@/lib/api/hooks';
import { useAuthEntity } from '@/contexts';
import { useVehicle } from '@/hooks/vehicle';

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

  // Fetch vehicle data directly (independent of conversation)
  const { vehicle: vehicleData } = useVehicle(vehicleId || undefined);

  // Fetch conversation (only when entityId is available) - NOT create
  const { conversation, loading: conversationLoading, error: conversationError, createConversation } = useConversation({
    vehicleId,
    entityId: entityId || undefined,
  });

  // Fetch messages for this conversation
  const {
    messages: dbMessages,
    loading: messagesLoading,
    sendMessage,
  } = useMessages(conversation?.id, entityId || undefined);

  // Transform database messages to ChatMessage format
  const messages: ChatMessage[] = dbMessages.map((msg, index) => {
    // Considera como bot se não for o próprio usuário
    const isBot = msg.sender_entity_id !== entityId;
    const timestamp = new Date(msg.created_at).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
    if (!entityId || !vehicleId) return;

    let conversationToUse = conversation;

    // Se não há conversa, criar antes de enviar a primeira mensagem
    if (!conversationToUse) {
      try {
        conversationToUse = await createConversation();
      } catch (error) {
        console.error('Error creating conversation:', error);
        return;
      }
    }

    // Enviar mensagem
    if (conversationToUse) {
      await sendMessage({
        conversation_id: conversationToUse.id,
        sender_entity_id: entityId,
        content: messageText,
        message_type: 'text',
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

  // Modal state for New Update
  const [showNewUpdateModal, setShowNewUpdateModal] = useState(false);

  const handleNewUpdatePress = () => {
    setShowNewUpdateModal(true);
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

  // Error state (apenas se houver erro real, não se apenas não existir conversa)
  if (conversationError) {
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

  // Build vehicle name from vehicleData (fetched directly)
  const brandName = vehicleData?.brands?.brand || '';
  const modelName = vehicleData?.models?.model || '';
  const versionName = vehicleData?.model_versions?.version || '';
  const vehicleName = `${brandName} ${modelName} ${versionName}`.trim() || 'Veículo';

  // Build vehicle details from plate, year, and color
  const activePlate = vehicleData?.plates?.find((p: any) => p.active) || vehicleData?.plates?.[0];
  const plateNumber = activePlate?.plate || '';
  const year = vehicleData?.model_year?.toString() || vehicleData?.manufacture_year?.toString() || '';
  const activeColor = vehicleData?.colors?.find((c: any) => c.active) || vehicleData?.colors?.[0];
  const colorName = activeColor?.color || '';

  const vehicleDetails = [plateNumber, year, colorName]
    .filter(Boolean)
    .join(' • ') || 'Sem informações';

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
            params: { vehicleId }
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
        onNewUpdatePress={handleNewUpdatePress}
      />

      {/* New Update Modal */}
      <NewUpdateModal
        visible={showNewUpdateModal}
        onClose={() => setShowNewUpdateModal(false)}
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
