import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react-native';

interface CollapsibleSectionProps {
  icon: LucideIcon;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = ({
  icon: Icon,
  title,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[
          styles.sectionHeaderCollapsible,
          isExpanded && styles.sectionHeaderCollapsibleExpanded,
        ]}
        onPress={onToggle}
      >
        <View style={styles.sectionHeaderLeft}>
          <Icon size={20} color={Colors.primary.light} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.chevronContainer}>
          {isExpanded ? (
            <ChevronUp size={20} color={Colors.text.placeholder} />
          ) : (
            <ChevronDown size={20} color={Colors.text.placeholder} />
          )}
        </View>
      </TouchableOpacity>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
  },
  sectionHeaderCollapsible: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  sectionHeaderCollapsibleExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronContainer: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
  },
  sectionContent: {
    padding: 16,
  },
});
