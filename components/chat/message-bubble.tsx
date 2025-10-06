import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'lucide-react-native';

interface MessageBubbleProps {
  type: 'user' | 'bot';
  message?: string;
  timestamp?: string;
  children?: React.ReactNode;
  hasImage?: boolean;
  data?: {
    liters?: number;
    price?: number;
    station?: string;
  };
}

export const MessageBubble = ({ type, message, timestamp, children, hasImage, data }: MessageBubbleProps) => {
  const isUser = type === 'user';

  if (isUser) {
    return (
      <View style={styles.containerUser}>
        <View style={styles.bubbleUser}>
          <View style={styles.headerUser}>
            <Text style={styles.labelUser}>Você</Text>
            <Text style={styles.timestampUser}>{timestamp}</Text>
          </View>
          {message && (
            <Text style={styles.messageUser}>{message}</Text>
          )}
          {hasImage && (
            <View style={styles.imagePlaceholder}>
              <Image size={16} color="#9ca3af" />
              <Text style={styles.imagePlaceholderText}>Imagem do painel enviada</Text>
            </View>
          )}
          {data && (
            <View style={styles.dataContainer}>
              <View style={styles.dataGrid}>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Volume:</Text>
                  <Text style={styles.dataValue}>{data.liters}L</Text>
                </View>
                <View style={styles.dataItem}>
                  <Text style={styles.dataLabel}>Total:</Text>
                  <Text style={styles.dataValue}>R$ {data.price?.toFixed(2)}</Text>
                </View>
                <View style={[styles.dataItem, styles.dataItemFull]}>
                  <Text style={styles.dataLabel}>Local:</Text>
                  <Text style={styles.dataValue}>{data.station}</Text>
                </View>
              </View>
            </View>
          )}
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.containerBot}>
      <View style={styles.bubbleBot}>
        <View style={styles.headerBot}>
          <View style={styles.headerBotLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>C</Text>
            </View>
            <Text style={styles.labelBot}>Chatmonitor</Text>
          </View>
          <Text style={styles.timestampBot}>{timestamp}</Text>
        </View>
        {message && (
          <Text style={styles.messageBot}>{message}</Text>
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  containerBot: {
    marginBottom: 24,
  },
  bubbleUser: {
    maxWidth: '85%',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleBot: {
    width: '100%',
  },
  headerUser: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  headerBot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  headerBotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 28,
    height: 28,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  labelUser: {
    fontSize: 12,
    fontWeight: '500',
    color: '#d1d5db',
  },
  labelBot: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  timestampUser: {
    fontSize: 12,
    color: '#d1d5db',
    flexShrink: 0,
  },
  timestampBot: {
    fontSize: 12,
    color: '#6b7280',
    flexShrink: 0,
  },
  messageUser: {
    fontSize: 15,
    lineHeight: 22,
    color: '#fff',
  },
  messageBot: {
    fontSize: 15,
    lineHeight: 22,
    color: '#111827',
  },
  dataContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  dataGrid: {
    gap: 8,
  },
  dataItem: {
    flexDirection: 'row',
    gap: 4,
  },
  dataItemFull: {
    flexDirection: 'column',
    gap: 4,
  },
  dataLabel: {
    fontSize: 12,
    color: '#d1d5db',
  },
  dataValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  imagePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: '#d1d5db',
  },
});
