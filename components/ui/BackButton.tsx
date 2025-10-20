import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants';

interface BackButtonProps {
  onPress?: () => void;
  variant?: 'back' | 'close';
  icon?: LucideIcon;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  variant = 'back',
  icon,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  const IconComponent = icon || (variant === 'close' ? X : ArrowLeft);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <IconComponent size={24} color={Colors.text.secondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
