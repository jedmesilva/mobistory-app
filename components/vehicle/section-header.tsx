import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react-native';

interface SectionHeaderProps {
  title: string;
  count: number;
  historicalCount: number;
  relationshipType: string;
  showHistoryFor: {[key: string]: boolean};
  toggleHistory: (relationshipType: string) => void;
}

export const SectionHeader = ({
  title,
  count,
  historicalCount,
  relationshipType,
  showHistoryFor,
  toggleHistory
}: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>
        {count} {count === 1 ? 'veículo ativo' : 'veículos ativos'}
      </Text>
    </View>
    {historicalCount > 0 && (
      <TouchableOpacity
        onPress={() => toggleHistory(relationshipType)}
        style={styles.historyButton}
      >
        <Clock size={16} color={Colors.text.secondary} />
        <Text style={styles.historyButtonText}>
          Histórico ({historicalCount})
        </Text>
        {showHistoryFor[relationshipType] ? (
          <ChevronUp size={16} color={Colors.text.secondary} />
        ) : (
          <ChevronDown size={16} color={Colors.text.secondary} />
        )}
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
});
