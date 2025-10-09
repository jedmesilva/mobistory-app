import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants';
import { Search, X } from 'lucide-react-native';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
}

export const SearchInput = forwardRef<TextInput, SearchInputProps>(
  ({ value, onChangeText, onClear, placeholder = 'Buscar...', showClearButton = true, ...props }, ref) => {
    const handleClear = () => {
      onChangeText('');
      onClear?.();
    };

    return (
      <View style={styles.container}>
        <Search size={20} color={Colors.text.placeholder} style={styles.searchIcon} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.placeholder}           style={styles.input}
          {...props}
        />
        {showClearButton && value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <X size={16} color={Colors.text.placeholder} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

SearchInput.displayName = 'SearchInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary.dark,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});
