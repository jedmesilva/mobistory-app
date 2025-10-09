import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants';

interface OilIconProps {
  size?: number;
  color?: string;
}

export const OilIcon = ({ size = 24, color = Colors.background.primary }: OilIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Oil can body */}
    <Path
      d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Handle */}
    <Path
      d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Spout */}
    <Path
      d="M18 10H20C20.5523 10 21 10.4477 21 11V13C21 13.5523 20.5523 14 20 14H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Oil drop */}
    <Circle cx="12" cy="14" r="1.5" fill={color} />
  </Svg>
);
