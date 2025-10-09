import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants';

interface ProgressCircleProps {
  progress: number; // 0-100
}

export const ProgressCircle = ({ progress }: ProgressCircleProps) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <View style={styles.progressCircle}>
      <Svg width={48} height={48} style={styles.progressSvg}>
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={4}
          fill="none"
        />
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={4}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="24, 24"
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressCircle: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.info.DEFAULT,
  },
});
