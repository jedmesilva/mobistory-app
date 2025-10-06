import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
            <TrendingUp size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.title}>Tendências</Text>
            <Text style={styles.subtitle}>Últimos meses</Text>
          </View>
        </View>
        <View style={styles.expandButton}>
          {expanded ? (
            <ChevronUp size={16} color="#6b7280" />
          ) : (
            <ChevronDown size={16} color="#6b7280" />
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    backgroundColor: '#1f2937',
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
  expandButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  content: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
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
    color: '#374151',
  },
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  efficiencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  efficiencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
});
