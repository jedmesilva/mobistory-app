import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Gauge } from 'lucide-react-native';

interface DashboardPhotoCardProps {
  imageUri?: string;
  kilometers: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export const DashboardPhotoCard = ({ imageUri, kilometers, stats }: DashboardPhotoCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Gauge size={16} color="#fff" />
        </View>
        <View>
          <Text style={styles.title}>Dados Identificados</Text>
          <Text style={styles.subtitle}>Quilometragem: {kilometers}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
