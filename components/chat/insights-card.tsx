import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { AlertTriangle, Info } from 'lucide-react-native';

interface InsightCardProps {
  type: 'alert' | 'info';
  title: string;
  description: string;
}

export const InsightsCard = ({ type, title, description }: InsightCardProps) => {
  const isAlert = type === 'alert';

  return (
    <View style={[
      styles.card,
      isAlert ? styles.cardAlert : styles.cardInfo
    ]}>
      <View style={[
        styles.iconContainer,
        isAlert ? styles.iconContainerAlert : styles.iconContainerInfo
      ]}>
        {isAlert ? (
          <AlertTriangle size={16} color={Colors.error.dark} />
        ) : (
          <Info size={16} color={Colors.info.dark} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 12,
  },
  cardAlert: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  cardInfo: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerAlert: {
    backgroundColor: Colors.error.light,
  },
  iconContainerInfo: {
    backgroundColor: Colors.info.light,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.text.tertiary,
    lineHeight: 18,
  },
});
