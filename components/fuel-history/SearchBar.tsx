import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Buscar por posto, data ou valor...',
}: SearchBarProps) => {
  return (
    <View style={styles.searchCard}>
      <View style={styles.searchContainer}>
        <Search size={16} color={Colors.text.placeholder} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.placeholder}           style={styles.searchInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 24,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.dark,
    padding: 0,
  },
});
