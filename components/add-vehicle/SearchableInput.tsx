import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants';
import { Plus, Check, X, BadgeCheck, BadgeAlert } from 'lucide-react-native';

export interface SuggestionItem {
  name: string;
  verified?: boolean;
}

interface SearchableInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  placeholder: string;
  showSuggestions: boolean;
  suggestions: string[] | SuggestionItem[];
  selectedValue?: string;
  onSelectSuggestion: (value: string) => void;
  onCreateNew: () => void;
  createNewLabel: string;
  successMessage?: string;
  autoFocus?: boolean;
  onClear?: () => void;
  onSubmitEditing?: () => void;
}

export const SearchableInput = ({
  value,
  onChangeText,
  onFocus,
  placeholder,
  showSuggestions,
  suggestions,
  selectedValue,
  onSelectSuggestion,
  onCreateNew,
  createNewLabel,
  successMessage,
  autoFocus = false,
  onClear,
  onSubmitEditing,
}: SearchableInputProps) => {
  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <View>
      {selectedValue && successMessage && (
        <View style={styles.successBanner}>
          <Check size={20} color={Colors.success.DEFAULT} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          style={styles.input}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="next"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <X size={20} color={Colors.text.placeholder} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
          >
            {suggestions.map((suggestion, index) => {
              // Suporte para string[] (legado) ou SuggestionItem[]
              const name = typeof suggestion === 'string' ? suggestion : suggestion.name;
              const verified = typeof suggestion === 'object' ? suggestion.verified : undefined;

              return (
                <TouchableOpacity
                  key={`${name}-${index}`}
                  onPress={() => onSelectSuggestion(name)}
                  style={styles.suggestionItem}
                  activeOpacity={1}
                >
                  <Text style={styles.suggestionText}>{name}</Text>
                  {verified !== undefined && (
                    <View style={styles.badgeContainer}>
                      {verified ? (
                        <>
                          <BadgeCheck size={16} color={Colors.success.DEFAULT} />
                          <Text style={styles.verifiedBadgeText}>Verificada</Text>
                        </>
                      ) : (
                        <>
                          <BadgeAlert size={16} color={Colors.text.placeholder} />
                          <Text style={styles.unverifiedBadgeText}>Não verificada</Text>
                        </>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={onCreateNew}
              style={styles.createNewItem}
              activeOpacity={1}
            >
              <Plus size={16} color={Colors.info.DEFAULT} />
              <Text style={styles.createNewText}>{createNewLabel}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.success.light,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.success.text,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    fontSize: 18,
    padding: 16,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    color: Colors.primary.dark,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    backgroundColor: Colors.background.primary,
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  suggestionsList: {
    maxHeight: 238,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary.dark,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success.DEFAULT,
  },
  unverifiedBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.placeholder,
  },
  createNewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  createNewText: {
    fontSize: 16,
    color: Colors.info.DEFAULT,
  },
});
