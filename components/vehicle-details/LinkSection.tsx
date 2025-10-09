import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { History, ChevronDown, ChevronUp } from 'lucide-react-native';
import { PersonCard, LinkedPerson } from './PersonCard';

interface LinkSectionProps {
  title: string;
  count: number;
  people: LinkedPerson[];
  formerPeople: LinkedPerson[];
  showHistory: boolean;
  onToggleHistory: () => void;
  selectedPerson: LinkedPerson | null;
  onSelectPerson: (person: LinkedPerson) => void;
}

export const LinkSection = ({
  title,
  count,
  people,
  formerPeople,
  showHistory,
  onToggleHistory,
  selectedPerson,
  onSelectPerson,
}: LinkSectionProps) => {
  return (
    <View style={styles.linkSection}>
      <View style={styles.linkSectionHeader}>
        <Text style={styles.linkSectionTitle}>
          {title} ({count})
        </Text>
        {formerPeople.length > 0 && (
          <TouchableOpacity style={styles.historyButton} onPress={onToggleHistory}>
            <History size={16} color={Colors.text.tertiary} />
            <Text style={styles.historyButtonText}>Anteriores ({formerPeople.length})</Text>
            {showHistory ? (
              <ChevronUp size={16} color={Colors.text.tertiary} />
            ) : (
              <ChevronDown size={16} color={Colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.linkList}>
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onClick={onSelectPerson}
            isSelected={selectedPerson?.id === person.id}
          />
        ))}
        {showHistory &&
          formerPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onClick={onSelectPerson}
              isSelected={selectedPerson?.id === person.id}
              isHistorical={true}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linkSection: {
    marginBottom: 24,
  },
  linkSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  linkSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyButtonText: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  linkList: {
    gap: 12,
  },
});
