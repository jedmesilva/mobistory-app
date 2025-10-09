import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react-native';

interface MonthData {
  month: string;
  value: number;
  percentage: number;
}

interface ConsumptionTrendsCardProps {
  data: MonthData[];
}

export const ConsumptionTrendsCard = ({ data }: ConsumptionTrendsCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <TrendingUp size={16} color={Colors.background.primary} />
          </View>
          <View>
            <Text style={styles.title}>Tendências</Text>
            <Text style={styles.subtitle}>Últimos meses</Text>
          </View>
        </View>
        <View style={styles.expandButton}>
          {expanded ? (
            <ChevronUp size={16} color={Colors.text.tertiary} />
          ) : (
            <ChevronDown size={16} color={Colors.text.tertiary} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.divider} />
          <View style={styles.detailsList}>
            {data.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.monthText}>{item.month}</Text>
                <View style={styles.detailRight}>
                  <Text style={styles.valueText}>{item.value} km/L</Text>
                  <View style={styles.efficiencyBadge}>
                    <Text style={styles.efficiencyText}>
                      {item.value >= 13 ? 'excelente' : 'boa'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  expandButton: {
    padding: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 8,
  },
  content: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background.tertiary,
    marginBottom: 12,
  },
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.light,
  },
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  efficiencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: Colors.success.light,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  efficiencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success.dark,
  },
});
