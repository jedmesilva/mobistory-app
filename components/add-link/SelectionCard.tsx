import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

interface SelectionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
}

export function SelectionCard({
  icon: IconComponent,
  title,
  description,
  onPress,
}: SelectionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconBox}>
        <IconComponent size={24} color={Colors.text.secondary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <ChevronRight size={20} color={Colors.text.placeholder} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
