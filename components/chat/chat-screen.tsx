import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { ChevronDown, ArrowUp, Plus, Mic, Camera, Calendar } from 'lucide-react-native';
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

interface DateGroup {
  date: string;
  messages: ChatMessage[];
}

interface ChatScreenProps {
  visible: boolean;
  onClose: () => void;
  vehicleName?: string;
}

export const ChatScreen = ({ visible, onClose, vehicleName = 'Honda Civic' }: ChatScreenProps) => {
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'user',
      message: 'Abasteci 42,5L no Shell Centro por R$ 255,30',
      timestamp: '14:30',
      date: '2025-09-20',
      data: {
        liters: 42.5,
        price: 255.30,
        station: 'Shell Centro',
      },
    },
    {
      id: 2,
      type: 'bot',
      message: 'Perfeito! Analisei seu abastecimento em detalhes. Seu consumo está excelente e você fez uma boa escolha de posto.',
      timestamp: '14:31',
      date: '2025-09-20',
      card: {
        type: 'fuel-analysis',
        volume: '42,5L',
        consumption: '12.7 km/L',
        price: 'R$ 6.01',
      },
    },
    {
      id: 3,
      type: 'bot',
      message: 'Encontrei alguns postos próximos com bons preços:',
      timestamp: '14:32',
      date: '2025-09-20',
      card: {
        type: 'price-comparison',
        stations: [
          { name: 'Shell Vila', distance: '2.1 km', price: 'R$ 5.85', trend: 'down', trendValue: '-0.16' },
          { name: 'Petrobras Centro', distance: '1.5 km', price: 'R$ 6.15', trend: 'up', trendValue: '+0.14' },
          { name: 'Ipiranga Norte', distance: '3.2 km', price: 'R$ 5.92', trend: 'down', trendValue: '-0.09' },
        ],
      },
    },
    {
      id: 4,
      type: 'user',
      message: 'Foto do painel',
      timestamp: '16:15',
      date: '2025-09-19',
      hasImage: true,
    },
    {
      id: 5,
      type: 'bot',
      message: 'Identifiquei os dados da sua foto! Quilometragem atual é 44.690 km, com boa autonomia restante.',
      timestamp: '16:15',
      date: '2025-09-19',
      card: {
        type: 'dashboard-photo',
        kilometers: '44.690 km',
        stats: [
          { label: '380 km desde último abastecimento', value: '' },
          { label: 'Autonomia', value: '~160 km restantes' },
          { label: 'Próximo abastecimento', value: 'em 2 dias' },
        ],
      },
    },
    {
      id: 6,
      type: 'user',
      message: 'E qual foi a tendência de consumo nos últimos meses?',
      timestamp: '10:33',
      date: '2025-09-19',
    },
    {
      id: 7,
      type: 'bot',
      message: 'Aqui está a tendência de consumo do seu veículo:',
      timestamp: '10:33',
      date: '2025-09-19',
      card: {
        type: 'consumption-trends',
        data: [
          { month: 'Jan', value: 11.8, percentage: 94 },
          { month: 'Fev', value: 12.2, percentage: 97 },
          { month: 'Mar', value: 13.1, percentage: 100 },
          { month: 'Abr', value: 12.5, percentage: 95 },
          { month: 'Mai', value: 12.8, percentage: 98 },
        ],
      },
    },
    {
      id: 8,
      type: 'bot',
      message: 'Aqui estão algumas estatísticas gerais do seu veículo:',
      timestamp: '10:34',
      date: '2025-09-19',
      card: {
        type: 'vehicle-stats',
        stats: [
          { label: 'Total de KM rodados', value: '45,234 km' },
          { label: 'Consumo médio geral', value: '12.5 km/L' },
          { label: 'Total gasto em combustível', value: 'R$ 8,456.00' },
          { label: 'Manutenções realizadas', value: '8 serviços' },
        ],
      },
    },
    {
      id: 9,
      type: 'bot',
      message: '',
      timestamp: '10:35',
      date: '2025-09-18',
      card: {
        type: 'insight-alert',
        title: 'Atenção: Revisão Próxima',
        description: 'Seu veículo está se aproximando dos 50.000 km. Recomendamos agendar uma revisão completa.',
      },
    },
    {
      id: 10,
      type: 'bot',
      message: 'Alerta de preços na sua região! Encontrei oportunidades de economia.',
      timestamp: '19:20',
      date: '2025-09-18',
      card: {
        type: 'insights-list',
        isAlert: true,
        insights: [
          { text: 'Gasolina subiu R$ 0,15 centavos' },
          { text: 'Shell Vila: R$ 5,85 (mais barato)' },
          { text: 'Melhor horário: terça de manhã' },
        ],
      },
    },
    {
      id: 11,
      type: 'bot',
      message: '',
      timestamp: '10:36',
      date: '2025-09-17',
      card: {
        type: 'insight-info',
        title: 'Dica de Economia',
        description: 'Você pode economizar até R$ 45,00 por mês abastecendo no Posto Ipiranga que está a 1.2 km de você.',
      },
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(1)).current;

  // Reset position when modal opens
  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      backdropOpacity.setValue(1);
    }
  }, [visible, translateY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          // Gradually increase transparency as user drags down
          // From opacity 1 to 0.3 over 150px drag (never fully transparent while dragging)
          const opacity = Math.max(0.3, 1 - (gestureState.dy / 150) * 0.7);
          backdropOpacity.setValue(opacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          onClose();
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(backdropOpacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleSend = () => {
    if (inputText.trim()) {
      const now = new Date();
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        type: 'user',
        message: inputText.trim(),
        timestamp: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        date: now.toISOString().split('T')[0],
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      Keyboard.dismiss();

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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
                  backgroundColor: card.isAlert ? '#fef2f2' : '#f9fafb',
                  borderWidth: 1,
                  borderColor: card.isAlert ? '#fecaca' : '#f3f4f6',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: card.isAlert ? '#991b1b' : '#374151',
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
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: backdropOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
            }),
          }
        ]}
      >
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
          {/* Header */}
          <View style={styles.header} {...panResponder.panHandlers}>
            <View>
              <Text style={styles.headerTitle}>ChatMonitor</Text>
              <Text style={styles.headerSubtitle}>{vehicleName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ChevronDown size={24} color="#374151" />
            </TouchableOpacity>
          </View>

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
                  <Calendar size={14} color="#6b7280" />
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
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>

          <View style={styles.inputActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Camera size={16} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setMoreOptionsVisible(true)}
              >
                <Plus size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <ArrowUp size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <MoreOptionsModal
          visible={moreOptionsVisible}
          onClose={() => setMoreOptionsVisible(false)}
          onOptionSelect={handleMoreOptions}
        />
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    color: '#111827',
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
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    backgroundColor: '#9ca3af',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1f2937',
  },
});
