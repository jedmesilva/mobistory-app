import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    if (activity.type === 'link') return '#374151';
    return '#374151';
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
    backgroundColor: '#fff',
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
    backgroundColor: '#f3f4f6',
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
    color: '#111827',
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
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
    color: '#6b7280',
  },
  activityTime: {
    fontSize: 13,
    color: '#9ca3af',
  },
  activityDetails: {
    marginTop: 12,
    backgroundColor: '#f9fafb',
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
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
});
