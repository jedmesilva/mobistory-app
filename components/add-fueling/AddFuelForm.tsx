import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants';
import { ChevronDown, Plus } from 'lucide-react-native';

interface FuelType {
  id: string;
  name: string;
  color: { bg: string; text: string };
}

interface AddFuelFormProps {
  currentItem: {
    liters: string;
    pricePerLiter: string;
    totalPrice: string;
    fuelType: string;
  };
  fuelTypes: FuelType[];
  editingIndex: number | null;
  showFuelDropdown: boolean;
  canAddItem: boolean;
  calculatedValue: string | null;
  onInputChange: (field: string, value: string) => void;
  onFuelTypeSelect: (type: FuelType) => void;
  onToggleDropdown: () => void;
  onAddItem: () => void;
  onCancelEdit: () => void;
  inline?: boolean;
}

export const AddFuelForm = ({
  currentItem,
  fuelTypes,
  editingIndex,
  showFuelDropdown,
  canAddItem,
  calculatedValue,
  onInputChange,
  onFuelTypeSelect,
  onToggleDropdown,
  onAddItem,
  onCancelEdit,
  inline = false,
}: AddFuelFormProps) => {
  const formContent = (
    <View>
      {!inline && (
        <View style={styles.header}>
          <Text style={styles.title}>
            {editingIndex !== null ? 'Editando Combustível' : 'Adicionar Combustível'}
          </Text>
          {editingIndex !== null && (
            <TouchableOpacity onPress={onCancelEdit}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={inline ? styles.bodyInline : styles.body}>
        {/* Fuel Type Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de combustível</Text>
          <TouchableOpacity onPress={onToggleDropdown} style={styles.dropdown}>
            <Text style={currentItem.fuelType ? styles.dropdownTextFilled : styles.dropdownTextEmpty}>
              {currentItem.fuelType || 'Selecione o combustível'}
            </Text>
            <ChevronDown size={20} color={Colors.text.placeholder} />
          </TouchableOpacity>

          {showFuelDropdown && (
            <View style={styles.dropdownMenu}>
              {fuelTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => onFuelTypeSelect(type)}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>{type.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Inputs Grid */}
        <View style={styles.inputsGrid}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Litros</Text>
            <TextInput
              value={currentItem.liters}
              onChangeText={(text) => onInputChange('liters', text)}
              placeholder="45,0"
              placeholderTextColor={Colors.text.placeholder}               keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputHalf}>
            <Text style={styles.label}>Preço/L</Text>
            <TextInput
              value={currentItem.pricePerLiter}
              onChangeText={(text) => onInputChange('pricePerLiter', text)}
              placeholder="5,49"
              placeholderTextColor={Colors.text.placeholder}               keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Valor total</Text>
          <TextInput
            value={currentItem.totalPrice}
            onChangeText={(text) => onInputChange('totalPrice', text)}
            placeholder="255,30"
            placeholderTextColor={Colors.text.placeholder}             keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {calculatedValue && (
          <View style={styles.calculatedBox}>
            <Text style={styles.calculatedLabel}>Valor calculado:</Text>
            <Text style={styles.calculatedValue}>{calculatedValue}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={onAddItem}
          disabled={!canAddItem}
          style={[styles.addButton, !canAddItem && styles.addButtonDisabled]}
        >
          <Plus size={16} color={canAddItem ? Colors.background.primary : Colors.text.placeholder} />
          <Text style={[styles.addButtonText, !canAddItem && styles.addButtonTextDisabled]}>
            {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (inline) {
    return formContent;
  }

  return (
    <View style={styles.container}>
      {formContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  cancelText: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  body: {
    padding: 16,
  },
  bodyInline: {
    padding: 0,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.light,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownTextFilled: {
    fontSize: 14,
    color: Colors.primary.dark,
  },
  dropdownTextEmpty: {
    fontSize: 14,
    color: Colors.text.placeholder,
  },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  inputsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.primary.dark,
  },
  calculatedBox: {
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: 16,
  },
  calculatedLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  calculatedValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
  },
  addButtonDisabled: {
    backgroundColor: Colors.background.tertiary,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  addButtonTextDisabled: {
    color: Colors.text.placeholder,
  },
});
