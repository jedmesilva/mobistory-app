import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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
}: AddFuelFormProps) => {
  return (
    <View style={styles.container}>
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

      <View style={styles.body}>
        {/* Fuel Type Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de combustível</Text>
          <TouchableOpacity onPress={onToggleDropdown} style={styles.dropdown}>
            <Text style={currentItem.fuelType ? styles.dropdownTextFilled : styles.dropdownTextEmpty}>
              {currentItem.fuelType || 'Selecione o combustível'}
            </Text>
            <ChevronDown size={20} color="#9ca3af" />
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
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputHalf}>
            <Text style={styles.label}>Preço/L</Text>
            <TextInput
              value={currentItem.pricePerLiter}
              onChangeText={(text) => onInputChange('pricePerLiter', text)}
              placeholder="5,49"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
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
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
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
          <Plus size={16} color={canAddItem ? '#fff' : '#9ca3af'} />
          <Text style={[styles.addButtonText, !canAddItem && styles.addButtonTextDisabled]}>
            {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cancelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  body: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownTextFilled: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownTextEmpty: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  calculatedBox: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 16,
  },
  calculatedLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  calculatedValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderRadius: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  addButtonTextDisabled: {
    color: '#9ca3af',
  },
});
