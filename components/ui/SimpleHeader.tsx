import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { BackButton } from './BackButton';

interface SimpleHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  onBackPress,
}) => {
  return (
    <View style={styles.header}>
      <BackButton onPress={onBackPress} />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
});
