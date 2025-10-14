import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants';

interface SimpleHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  onBackPress,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <ArrowLeft size={24} color={Colors.text.primary} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
});
