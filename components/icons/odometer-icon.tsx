import React from 'react';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

interface OdometerIconProps {
  size?: number;
  color?: string;
}

export const OdometerIcon = ({ size = 24, color = '#fff' }: OdometerIconProps) => {
  const width = size * 1.6;
  const height = size;

  return (
    <Svg width={width} height={height} viewBox="0 0 40 24">
      <Rect x="2" y="2" width="36" height="20" fill={color} opacity="0.1" rx="1" />
      <Rect x="3" y="3" width="34" height="18" fill="none" stroke={color} strokeWidth="1.5" rx="0.5" />
      <Rect x="5" y="5" width="8" height="14" fill={color} opacity="0.15" rx="0.5" />
      <SvgText x="9" y="15" fontSize="10" fill={color} textAnchor="middle" fontFamily="Arial Black" fontWeight="900">
        4
      </SvgText>
      <Rect x="16" y="5" width="8" height="14" fill={color} opacity="0.15" rx="0.5" />
      <SvgText x="20" y="15" fontSize="10" fill={color} textAnchor="middle" fontFamily="Arial Black" fontWeight="900">
        5
      </SvgText>
      <Rect x="27" y="5" width="8" height="14" fill={color} opacity="0.15" rx="0.5" />
      <SvgText x="31" y="15" fontSize="10" fill={color} textAnchor="middle" fontFamily="Arial Black" fontWeight="900">
        2
      </SvgText>
    </Svg>
  );
};
