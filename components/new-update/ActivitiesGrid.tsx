import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityCard } from './ActivityCard';

export interface ActivityType {
  id: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  description: string;
}

interface ActivitiesGridProps {
  activities: ActivityType[];
  onActivityPress: (activityId: string) => void;
}

export const ActivitiesGrid: React.FC<ActivitiesGridProps> = ({
  activities,
  onActivityPress,
}) => {
  return (
    <View style={styles.grid}>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          icon={activity.icon}
          label={activity.label}
          description={activity.description}
          onPress={() => onActivityPress(activity.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
});
