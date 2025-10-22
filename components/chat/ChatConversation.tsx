import React, { useState, useRef, useEffect } from 'react';
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
import { ArrowUp, Plus, Camera, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants';
import { MessageBubble } from './message-bubble';
import { FuelAnalysisCard } from './fuel-analysis-card';
import { PriceComparisonCard } from './price-comparison-card';
import { ConsumptionTrendsCard } from './consumption-trends-card';
import { VehicleStatsCard } from './vehicle-stats-card';
import { InsightsCard } from './insights-card';
import { MoreOptionsModal } from './more-options-modal';
import { DashboardPhotoCard } from './dashboard-photo-card';

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

interface ChatConversationProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  showCameraButton?: boolean;
  onCameraPress?: () => void;
}

export function ChatConversation({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Adicionar evento, fazer pergunta...',
  showCameraButton = true,
  onCameraPress,
}: ChatConversationProps) {
  const [inputText, setInputText] = useState('');
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (inputText.trim()) {
      try {
        await onSendMessage(inputText.trim());
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

  const handleCameraPress = () => {
    if (onCameraPress) {
      onCameraPress();
    }
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
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

        {isLoading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
            <Text style={styles.loadingText}>Processando...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.text.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.inputActions}>
          <View style={styles.leftActions}>
            {showCameraButton && (
              <TouchableOpacity style={styles.actionButton} onPress={handleCameraPress}>
                <Camera size={16} color={Colors.text.tertiary} />
              </TouchableOpacity>
            )}

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
            disabled={!inputText.trim() || isLoading}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.tertiary,
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
});
