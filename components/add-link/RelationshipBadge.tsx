import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { LucideIcon } from 'lucide-react-native';

interface RelationshipBadgeProps {
  icon: LucideIcon;
  title: string;
  onChangePress: () => void;
}

export function RelationshipBadge({
  icon: IconComponent,
  title,
  onChangePress,
}: RelationshipBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <IconComponent size={20} color={Colors.primary.dark} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Tipo de vínculo</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onChangePress}>
          <Text style={styles.changeButton}>Alterar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
});
