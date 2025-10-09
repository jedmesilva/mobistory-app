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
    padding: 20,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.text.placeholder,
    marginTop: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
