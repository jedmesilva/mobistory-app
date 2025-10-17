import React, { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUp, Plus, Camera, Calendar, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants';
import { VehicleHeader } from '@/components/ui';
import { MessageBubble } from '../../components/chat/message-bubble';
import { FuelAnalysisCard } from '../../components/chat/fuel-analysis-card';
import { PriceComparisonCard } from '../../components/chat/price-comparison-card';
import { ConsumptionTrendsCard } from '../../components/chat/consumption-trends-card';
import { VehicleStatsCard } from '../../components/chat/vehicle-stats-card';
import { InsightsCard } from '../../components/chat/insights-card';
import { MoreOptionsModal } from '../../components/chat/more-options-modal';
import { DashboardPhotoCard } from '../../components/chat/dashboard-photo-card';
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
  const { entityId } = useAuthEntity();

  // Get vehicle ID from params (passed as 'id')
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Fetch or create conversation
  const { conversation, loading: conversationLoading, error: conversationError } = useConversation({
    vehicleId,
    entityId: entityId || undefined,
  });

  // Fetch messages for this conversation
  const { messages: dbMessages, loading: messagesLoading, sendMessage } = useMessages(conversation?.id);

  const formatDate = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const [inputText, setInputText] = useState('');
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (inputText.trim() && conversation && entityId) {
      try {
        await sendMessage({
          conversationId: conversation.id,
          senderId: entityId,
          content: inputText.trim(),
          messageType: 'text',
        });
        setInputText('');
        Keyboard.dismiss();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleMoreOptions = (type: string) => {
    console.log('Selected option:', type);
  };

  const renderCard = (card: any) => {
    switch (card.type) {
      case 'fuel-analysis':
        return <FuelAnalysisCard volume={card.volume} consumption={card.consumption} price={card.price} />;
      case 'price-comparison':
        return <PriceComparisonCard stations={card.stations} />;
      case 'consumption-trends':
        return <ConsumptionTrendsCard data={card.data} />;
      case 'vehicle-stats':
        return <VehicleStatsCard stats={card.stats} />;
      case 'dashboard-photo':
        return <DashboardPhotoCard kilometers={card.kilometers} stats={card.stats} />;
      case 'insights-list':
        return (
          <View style={{ gap: 12, marginTop: 16 }}>
            {card.insights.map((insight: any, index: number) => (
              <View
                key={index}
                style={{
                  backgroundColor: card.isAlert ? '#fef2f2' : Colors.background.secondary,
                  borderWidth: 1,
                  borderColor: card.isAlert ? '#fecaca' : Colors.background.tertiary,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: card.isAlert ? Colors.error.text : Colors.primary.light,
                  }}
                >
                  {insight.text}
                </Text>
              </View>
            ))}
          </View>
        );
      case 'insight-alert':
        return <InsightsCard type="alert" title={card.title} description={card.description} />;
      case 'insight-info':
        return <InsightsCard type="info" title={card.title} description={card.description} />;
      default:
        return null;
    }
  };

  // Loading state
  if (conversationLoading || messagesLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Carregando conversa...</Text>
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

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <SafeAreaView edges={['top']}>
          <VehicleHeader
            vehicleName={vehicleName}
            vehicleDetails={vehicleDetails}
            onVehiclePress={() => router.push({
              pathname: '/vehicle-profile',
              params: { vehicleId: vehicle.id }
            })}
            showChevron={false}
            showVehicleIcon={false}
            leftButton={
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            }
          />
        </SafeAreaView>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {(() => {
            const groupedHistory: { [key: string]: ChatMessage[] } = {};
            messages.forEach((msg) => {
              const dateKey = formatDate(msg.date);
              if (!groupedHistory[dateKey]) {
                groupedHistory[dateKey] = [];
              }
              groupedHistory[dateKey].push(msg);
            });

            const sortedGroupEntries = Object.entries(groupedHistory).sort(([dateA], [dateB]) => {
              const getActualDate = (displayDate: string) => {
                if (displayDate === 'Hoje') return new Date();
                if (displayDate === 'Ontem') {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  return yesterday;
                }
                const msg = messages.find((m) => formatDate(m.date) === displayDate);
                return msg ? new Date(msg.date) : new Date();
              };

              return getActualDate(dateA).getTime() - getActualDate(dateB).getTime();
            });

            return sortedGroupEntries.map(([dateGroup, msgs]) => (
              <View key={dateGroup} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Calendar size={14} color={Colors.text.tertiary} />
                  <Text style={styles.dateHeaderText}>{dateGroup}</Text>
                </View>

                {msgs.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    type={msg.type}
                    message={msg.message}
                    timestamp={msg.timestamp}
                    hasImage={msg.hasImage}
                    data={msg.data}
                  >
                    {msg.card && renderCard(msg.card)}
                  </MessageBubble>
                ))}
              </View>
            ));
          })()}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Adicionar evento, fazer pergunta..."
              placeholderTextColor={Colors.text.placeholder}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>

          <View style={styles.inputActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Camera size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setMoreOptionsVisible(true)}
              >
                <Plus size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <ArrowUp size={16} color={Colors.background.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <MoreOptionsModal
          visible={moreOptionsVisible}
          onClose={() => setMoreOptionsVisible(false)}
          onOptionSelect={handleMoreOptions}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  messagesContent: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    color: Colors.primary.dark,
    minHeight: 24,
    maxHeight: 128,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    outlineStyle: 'none',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.text.placeholder,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary.DEFAULT,
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
