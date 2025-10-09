import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { ChevronRight } from 'lucide-react-native';

export interface LinkedPerson {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  relationshipType: 'owner' | 'renter' | 'authorized_driver';
  status: 'active' | 'former';
  linkedDate: string;
  lastAccess: string;
}

interface PersonCardProps {
  person: LinkedPerson;
  onClick: (person: LinkedPerson) => void;
  isSelected: boolean;
  isHistorical?: boolean;
}

const relationshipConfig = {
  owner: { label: 'Proprietário', badge: { bg: '#eff6ff', text: '#1d4ed8', border: Colors.info.light } },
  renter: { label: 'Locatário', badge: { bg: '#f0fdf4', text: '#15803d', border: Colors.success.light } },
  authorized_driver: { label: 'Condutor', badge: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' } },
};

export const PersonCard = ({ person, onClick, isSelected, isHistorical = false }: PersonCardProps) => {
  const config = relationshipConfig[person.relationshipType];
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity
      onPress={() => onClick(person)}
      style={[
        styles.personCard,
        isSelected && styles.personCardSelected,
        isHistorical && styles.personCardHistorical,
      ]}
    >
      <View style={styles.personCardHeader}>
        <View style={[styles.personAvatar, isHistorical && styles.personAvatarHistorical]}>
          <Text style={styles.personAvatarText}>{initials}</Text>
        </View>

        <View style={styles.personInfo}>
          <Text style={[styles.personName, isHistorical && styles.personNameHistorical]}>
            {person.name}
          </Text>

          <Text style={styles.personEmail}>{person.email}</Text>

          <View
            style={[
              styles.personBadge,
              {
                backgroundColor: isHistorical ? Colors.background.tertiary : config.badge.bg,
                borderColor: isHistorical ? Colors.border.DEFAULT : config.badge.border,
              },
            ]}
          >
            <Text
              style={[
                styles.personBadgeText,
                { color: isHistorical ? Colors.text.tertiary : config.badge.text },
              ]}
            >
              {config.label}
            </Text>
          </View>

          <View style={styles.personCardFooter}>
            <View style={styles.personCardFooterItem}>
              <Text style={styles.personCardFooterLabel}>VINCULADO EM</Text>
              <Text style={[styles.personCardFooterValue, isHistorical && styles.personCardFooterValueHistorical]}>
                {person.linkedDate}
              </Text>
            </View>
            <View style={styles.personCardFooterItem}>
              <Text style={[styles.personCardFooterLabel, styles.personCardFooterLabelRight]}>ÚLTIMO ACESSO</Text>
              <Text style={[styles.personCardFooterValue, styles.personCardFooterValueRight, isHistorical && styles.personCardFooterValueHistorical]}>
                {person.lastAccess}
              </Text>
            </View>
          </View>
        </View>

        <ChevronRight size={20} color={Colors.text.placeholder} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  personCard: {
    backgroundColor: Colors.background.primary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
  },
  personCardSelected: {
    borderColor: Colors.primary.DEFAULT,
  },
  personCardHistorical: {
    opacity: 0.6,
  },
  personCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  personAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personAvatarHistorical: {
    backgroundColor: Colors.text.placeholder,
  },
  personAvatarText: {
    color: Colors.background.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  personNameHistorical: {
    color: Colors.text.tertiary,
  },
  personEmail: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  personBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  personBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  personCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
    gap: 16,
  },
  personCardFooterItem: {
    flex: 1,
  },
  personCardFooterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  personCardFooterLabelRight: {
    textAlign: 'right',
  },
  personCardFooterValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  personCardFooterValueRight: {
    textAlign: 'right',
  },
  personCardFooterValueHistorical: {
    color: Colors.text.tertiary,
  },
});
