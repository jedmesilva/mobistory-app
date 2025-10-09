import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Shield, UserPlus, Send } from 'lucide-react-native';
import { ScreenHeader } from '@/components/add-link/ScreenHeader';
import { ScreenTitle } from '@/components/add-link/ScreenTitle';
import { SelectionCard } from '@/components/add-link/SelectionCard';

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
    router.push({
      pathname: '/add-link/select-type',
      params: { vehicleId: params.vehicleId, action: optionId },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader onPress={() => router.back()} variant="close" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ScreenTitle
            title="Inicie um novo vínculo"
            subtitle="Escolha como iniciar um novo vínculo com"
            vehicleName={`${vehicleData.brand} ${vehicleData.model}`}
          />

          <View style={styles.optionsList}>
            {linkOptions.map((option) => (
              <SelectionCard
                key={option.id}
                icon={option.icon}
                title={option.title}
                description={option.description}
                onPress={() => handleOptionSelect(option.id)}
              />
            ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  optionsList: {
    gap: 16,
  },
});
