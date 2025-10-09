import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface ActivityDetail {
  label: string;
  value: string;
}

interface Activity {
  id: number;
  type: string;
  icon: any;
  title: string;
  description: string;
  time: string;
  linkType?: string;
  isActive?: boolean;
  details?: ActivityDetail[];
  status?: string;
}

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const IconComponent = activity.icon;

  const getIconColor = () => {
    if (activity.status === 'warning') return '#ea580c';
    if (activity.type === 'link') return Colors.primary.light;
    return Colors.primary.light;
  };

  return (
    <View style={styles.activityCard}>
      <View style={styles.activityCardContent}>
        <View style={styles.activityIconContainer}>
          <IconComponent size={20} color={getIconColor()} />
        </View>

        <View style={styles.activityInfo}>
          <View style={styles.activityHeader}>
            <View style={styles.activityTitleContainer}>
              <View style={styles.activityTitleRow}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                {activity.isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Ativo</Text>
                  </View>
                )}
              </View>
              <Text style={styles.activityDescription}>{activity.description}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>

          {activity.details && activity.details.length > 0 && (
            <View style={styles.activityDetails}>
              <View style={styles.detailsGrid}>
                {activity.details.map((detail, idx) => (
                  <View key={idx} style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    marginBottom: 12,
  },
  activityCardContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  activityTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: Colors.success.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  activityTime: {
    fontSize: 13,
    color: Colors.text.placeholder,
  },
  activityDetails: {
    marginTop: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 12,
  },
  detailsGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.text.tertiary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
});
