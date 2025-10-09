import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { Edit3 } from 'lucide-react-native';

interface ConfirmationFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isHalf?: boolean;
  renderValue?: () => React.ReactNode;
}

export const ConfirmationField = ({
  label,
  value,
  onEdit,
  isHalf = false,
  renderValue,
}: ConfirmationFieldProps) => {
  return (
    <TouchableOpacity
      onPress={onEdit}
      style={[styles.confirmationField, isHalf && styles.confirmationFieldHalf]}
    >
      <View style={styles.confirmationFieldContent}>
        <Text style={styles.confirmationLabel}>{label}</Text>
        {renderValue ? renderValue() : <Text style={styles.confirmationValue}>{value}</Text>}
      </View>
      {!isHalf && <Edit3 size={16} color={Colors.text.placeholder} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirmationField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  confirmationFieldHalf: {
    flex: 1,
  },
  confirmationFieldContent: {
    flex: 1,
  },
  confirmationLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
});
