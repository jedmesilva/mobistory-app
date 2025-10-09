import React from 'react';
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
    },
    {
      id: 'request',
      title: 'Solicitar Vínculo',
      description: 'Preciso pedir autorização ao proprietário atual',
      icon: UserPlus,
    },
    {
      id: 'grant',
      title: 'Conceder Vínculo',
      description: 'Sou proprietário e quero dar acesso a outra pessoa',
      icon: Send,
    },
  ];

  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'grant') {
      router.push({
        pathname: '/add-link/grant-invite',
        params: { vehicleId: params.vehicleId },
      });
    } else {
      router.push({
        pathname: '/add-link/select-type',
        params: { vehicleId: params.vehicleId, action: optionId },
      });
    }
  };

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

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(option.id)}
                  style={styles.optionCard}
                >
                  <View style={styles.iconBox}>
                    <IconComponent size={24} color={Colors.text.secondary} />
                  </View>

                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>

                  <ChevronRight size={20} color={Colors.text.placeholder} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
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
});
