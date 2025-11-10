import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors } from '@/constants';
import { ChatConversation } from '@/components/chat';
import { useConversation, useMessages } from '@/lib/api/hooks/useConversations';
import { useAuthEntity } from '@/contexts';

interface CapturedMedia {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  timestamp: number;
}

interface ChatScreenProps {
  captureData: CapturedMedia[];
  vehicleId: string;
  context: string;
  onComplete: () => void;
  onBack: () => void;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp?: string;
  date: string;
  card?: any;
  hasImage?: boolean;
  data?: any;
}

export default function ChatScreen({
  captureData,
  vehicleId,
  context,
  onComplete,
  onBack,
}: ChatScreenProps) {
  const { entityId, loading: entityLoading } = useAuthEntity();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch conversation (NOT create automatically)
  const { conversation, loading: conversationLoading, createConversation } = useConversation({
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

  // Send initial message with captured media
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (!captureData || captureData.length === 0 || !entityId || !vehicleId || messages.length > 0) return;

      let conversationToUse = conversation;

      // Criar conversa se não existir
      if (!conversationToUse) {
        try {
          conversationToUse = await createConversation();
        } catch (error) {
          console.error('Error creating conversation:', error);
          return;
        }
      }

      const contextMessages: { [key: string]: string } = {
        open: `Capturei ${captureData.length} ${captureData.length === 1 ? 'arquivo' : 'arquivos'} do meu veículo. O que você consegue identificar?`,
        fueling: `Capturei ${captureData.length} ${captureData.length === 1 ? 'imagem' : 'imagens'} do painel da bomba de combustível. Consegue extrair os dados?`,
        odometer: `Capturei ${captureData.length} ${captureData.length === 1 ? 'imagem' : 'imagens'} do painel do odômetro. Qual a quilometragem?`,
      };

      const message = contextMessages[context] || `Capturei ${captureData.length} ${captureData.length === 1 ? 'arquivo' : 'arquivos'}.`;

      // TODO: Send message with media attachment
      if (conversationToUse) {
        sendMessage({
          conversation_id: conversationToUse.id,
          sender_entity_id: entityId,
          content: message,
          message_type: 'text',
        });
      }
    };

    sendInitialMessage();
  }, [captureData.length, conversation, entityId, vehicleId, context, messages.length]);

  const handleSendMessage = async (messageText: string) => {
    if (!entityId || !vehicleId) return;

    let conversationToUse = conversation;

    // Se não há conversa, criar antes de enviar a mensagem
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

  const handleConfirm = () => {
    // TODO: Extract data from chat and pass back
    onComplete();
  };

  const getTitle = () => {
    switch (context) {
      case 'fueling':
        return 'Confirmar Abastecimento';
      case 'odometer':
        return 'Confirmar Quilometragem';
      default:
        return 'Conversa sobre a Captura';
    }
  };

  if (entityLoading || conversationLoading || messagesLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Carregando conversa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <Text style={styles.headerSubtitle}>Verifique os dados identificados</Text>
        </View>
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Check size={20} color={Colors.background.primary} />
        </TouchableOpacity>
      </View>

      {/* Captured Media Preview */}
      {captureData && captureData.length > 0 && (
        <View style={styles.mediaPreview}>
          <RNImage
            source={{ uri: captureData[0].uri }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
          {captureData.length > 1 && (
            <View style={styles.mediaCount}>
              <Text style={styles.mediaCountText}>+{captureData.length - 1}</Text>
            </View>
          )}
        </View>
      )}

      {/* Chat Conversation */}
      <ChatConversation
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isProcessing}
        placeholder="Confirme ou corrija os dados..."
        showCameraButton={false}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  confirmButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPreview: {
    height: 120,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mediaCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
  },
});
