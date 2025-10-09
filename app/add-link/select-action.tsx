import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  X,
  Shield,
  UserPlus,
  Send,
  ChevronRight,
} from 'lucide-react-native';

export default function SelectActionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState('');

  const vehicleData = {
    brand: 'Honda',
    model: 'Civic',
    plate: 'ABC-1234',
  };

  const linkOptions = [
    {
      id: 'claim',
      title: 'Reivindicar Vínculo',
      description: 'Tenho documentos que comprovam minha relação com o veículo',
      icon: Shield,
      details: 'Envie documentos (contrato de compra, locação, etc.) para comprovar seu vínculo. Não requer aprovação prévia.',
    },
    {
      id: 'request',
      title: 'Solicitar Vínculo',
      description: 'Preciso pedir autorização ao proprietário atual',
      icon: UserPlus,
      details: 'Envie uma solicitação de acesso que será avaliada e aprovada pelo proprietário do veículo.',
    },
    {
      id: 'grant',
      title: 'Conceder Vínculo',
      description: 'Sou proprietário e quero dar acesso a outra pessoa',
      icon: Send,
      details: 'Envie um convite para que outra pessoa aceite o vínculo que você está concedendo.',
    },
  ];

  const handleContinue = () => {
    if (selectedOption === 'grant') {
      router.push({
        pathname: '/add-link/grant-invite',
        params: { vehicleId: params.vehicleId },
      });
    } else {
      router.push({
        pathname: '/add-link/select-type',
        params: { vehicleId: params.vehicleId, action: selectedOption },
      });
    }
  };

  const selectedOptionData = linkOptions.find((opt) => opt.id === selectedOption);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Inicie um novo vínculo</Text>
          <Text style={styles.subtitle}>
            Escolha como iniciar um novo vínculo com{' '}
            <Text style={styles.vehicleName}>
              {vehicleData.brand} {vehicleData.model}
            </Text>
          </Text>

          <View style={styles.optionsList}>
            {linkOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedOption === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedOption(option.id)}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                >
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    <IconComponent
                      size={24}
                      color={isSelected ? Colors.background.primary : Colors.text.secondary}
                    />
                  </View>

                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>

                  <ChevronRight
                    size={20}
                    color={isSelected ? Colors.primary.dark : Colors.text.placeholder}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedOptionData && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Próximo passo:</Text>
              <Text style={styles.detailsText}>{selectedOptionData.details}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedOption && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  vehicleName: {
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  optionsList: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    gap: 12,
  },
  optionCardSelected: {
    borderColor: Colors.primary.dark,
    backgroundColor: Colors.background.secondary,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: Colors.primary.dark,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  detailsBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  continueButton: {
    backgroundColor: Colors.primary.dark,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
