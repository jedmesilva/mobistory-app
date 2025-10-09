import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface InsightItemProps {
  children: ReactNode;
}

const InsightItem = ({ children }: InsightItemProps) => (
  <View style={styles.insightItem}>
    <View style={styles.bullet} />
    <Text style={styles.insightText}>{children}</Text>
  </View>
);

interface InsightsBoxProps {
  title: string;
  children: ReactNode;
}

export const InsightsBox = ({ title, children }: InsightsBoxProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>{children}</View>
    </View>
  );
};

InsightsBox.Item = InsightItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.text.placeholder,
    marginTop: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 19,
  },
});
