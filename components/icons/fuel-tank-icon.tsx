import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { Colors } from '@/constants';

interface FuelTankIconProps {
  size?: number;
  color?: string;
  level?: number;
}

export const FuelTankIcon = ({ size = 24, color = Colors.background.primary, level = 0.6 }: FuelTankIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="6" y="6" width="12" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="7" y={6 + 13 * (1 - level)} width="10" height={13 * level} rx="1" fill={color} opacity="0.3" />
    <Rect x="18" y="10" width="2" height="4" rx="1" fill={color} />
    <Rect x="18" y="11" width="2" height="2" fill={color} />
  </Svg>
);
