import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Key, FileText, Users, Wrench, Edit3 } from 'lucide-react-native';
import { ScreenHeader } from '@/components/add-link/ScreenHeader';
import { ScreenTitle } from '@/components/add-link/ScreenTitle';
import { SelectionCard } from '@/components/add-link/SelectionCard';

export default function SelectTypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const vehicleData = {
    brand: 'Honda',
    model: 'Civic',
    plate: 'ABC-1234',
  };

  const relationships = [
    {
      id: 'owner',
      title: 'Proprietário',
      description: 'Sou o dono legal do veículo',
      icon: Key,
    },
    {
      id: 'renter',
      title: 'Locatário',
      description: 'Veículo alugado, financiado ou arrendado',
      icon: FileText,
    },
    {
      id: 'authorized_driver',
      title: 'Condutor',
      description: 'Uso familiar, empresarial ou com autorização',
      icon: Users,
    },
    {
      id: 'technical',
      title: 'Responsável Técnico',
      description: 'Mecânico, oficina, gestor de frota',
      icon: Wrench,
    },
    {
      id: 'other',
      title: 'Outro',
      description: 'Especificar tipo de vínculo personalizado',
      icon: Edit3,
    },
  ];

  const handleRelationshipSelect = (relationshipId: string) => {
    // Se a ação for "grant", vai para grant-invite (etapa 3.1)
    // Se for "claim" ou "request", vai para document-upload (etapa 3)
    if (params.action === 'grant') {
      router.push({
        pathname: '/add-link/grant-invite',
        params: {
          vehicleId: params.vehicleId,
          relationshipType: relationshipId,
        },
      });
    } else {
      router.push({
        pathname: '/add-link/document-upload',
        params: {
          vehicleId: params.vehicleId,
          action: params.action,
          relationshipType: relationshipId,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader onPress={() => router.back()} variant="back" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ScreenTitle
            title="Tipo de vínculo"
            subtitle="Escolha o tipo de vínculo com"
            vehicleName={`${vehicleData.brand} ${vehicleData.model}`}
          />

          <View style={styles.relationshipsList}>
            {relationships.map((relationship) => (
              <SelectionCard
                key={relationship.id}
                icon={relationship.icon}
                title={relationship.title}
                description={relationship.description}
                onPress={() => handleRelationshipSelect(relationship.id)}
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
  relationshipsList: {
    gap: 16,
  },
});
