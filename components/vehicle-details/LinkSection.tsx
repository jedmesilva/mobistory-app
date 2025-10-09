import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react-native';
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
        <View>
          <Text style={styles.linkSectionTitle}>{title}</Text>
          <Text style={styles.linkSectionSubtitle}>
            {count} {count === 1 ? 'pessoa ativa' : 'pessoas ativas'}
          </Text>
        </View>
        {formerPeople.length > 0 && (
          <TouchableOpacity style={styles.historyButton} onPress={onToggleHistory}>
            <Clock size={16} color={Colors.text.secondary} />
            <Text style={styles.historyButtonText}>Histórico ({formerPeople.length})</Text>
            {showHistory ? (
              <ChevronUp size={16} color={Colors.text.secondary} />
            ) : (
              <ChevronDown size={16} color={Colors.text.secondary} />
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
        {showHistory && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Histórico</Text>
              <View style={styles.dividerLine} />
            </View>
            {formerPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onClick={onSelectPerson}
                isSelected={selectedPerson?.id === person.id}
                isHistorical={true}
              />
            ))}
          </>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  linkSectionSubtitle: {
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
  linkList: {
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.DEFAULT,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
