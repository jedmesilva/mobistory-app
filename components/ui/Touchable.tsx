import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

/**
 * Componente Touchable customizado sem efeito de opacity
 */
export const Touchable: React.FC<TouchableOpacityProps> = (props) => {
  return <TouchableOpacity {...props} activeOpacity={1} />;
};
