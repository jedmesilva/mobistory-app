import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  owner: { label: 'Proprietário', badge: { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' } },
  renter: { label: 'Locatário', badge: { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' } },
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
        <View style={styles.personCardLeft}>
          <View style={[styles.personAvatar, isHistorical && styles.personAvatarHistorical]}>
            <Text style={styles.personAvatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={[styles.personName, isHistorical && styles.personNameHistorical]}>
              {person.name}
            </Text>
            <Text style={styles.personEmail}>{person.email}</Text>
          </View>
        </View>
        <View style={styles.personCardRight}>
          <View
            style={[
              styles.personBadge,
              {
                backgroundColor: isHistorical ? '#f3f4f6' : config.badge.bg,
                borderColor: isHistorical ? '#e5e7eb' : config.badge.border,
              },
            ]}
          >
            <Text
              style={[
                styles.personBadgeText,
                { color: isHistorical ? '#6b7280' : config.badge.text },
              ]}
            >
              {config.label}
            </Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </View>
      </View>
      <View style={styles.personCardFooter}>
        <View style={styles.personCardFooterItem}>
          <Text style={styles.personCardFooterLabel}>Vinculado em</Text>
          <Text style={[styles.personCardFooterValue, isHistorical && styles.personCardFooterValueHistorical]}>
            {person.linkedDate}
          </Text>
        </View>
        <View style={styles.personCardFooterItem}>
          <Text style={styles.personCardFooterLabel}>Último acesso</Text>
          <Text style={[styles.personCardFooterValue, isHistorical && styles.personCardFooterValueHistorical]}>
            {person.lastAccess}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  personCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  personCardSelected: {
    borderColor: '#1f2937',
  },
  personCardHistorical: {
    opacity: 0.6,
  },
  personCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  personCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  personAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personAvatarHistorical: {
    backgroundColor: '#9ca3af',
  },
  personAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  personNameHistorical: {
    color: '#6b7280',
  },
  personEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  personCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  personBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  personCardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  personCardFooterItem: {
    flex: 1,
  },
  personCardFooterLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  personCardFooterValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  personCardFooterValueHistorical: {
    color: '#6b7280',
  },
});
