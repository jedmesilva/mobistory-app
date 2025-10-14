import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

/**
 * Componente Touchable customizado que remove o efeito de opacidade padrão
 * do TouchableOpacity, mantendo apenas o feedback visual do sistema.
 */
export const Touchable: React.FC<TouchableOpacityProps> = (props) => {
  return <TouchableOpacity {...props} activeOpacity={0.7} />;
};
