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
  ArrowLeft,
  Key,
  FileText,
  Users,
  Wrench,
  Edit3,
  ChevronRight,
} from 'lucide-react-native';

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
    router.push({
      pathname: '/add-link/document-upload',
      params: {
        vehicleId: params.vehicleId,
        action: params.action,
        relationshipType: relationshipId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Tipo de vínculo</Text>
          <Text style={styles.subtitle}>
            Escolha o tipo de vínculo com{' '}
            <Text style={styles.vehicleName}>
              {vehicleData.brand} {vehicleData.model}
            </Text>
          </Text>

          <View style={styles.relationshipsList}>
            {relationships.map((relationship) => {
              const IconComponent = relationship.icon;

              return (
                <TouchableOpacity
                  key={relationship.id}
                  onPress={() => handleRelationshipSelect(relationship.id)}
                  style={styles.relationshipCard}
                >
                  <View style={styles.iconBox}>
                    <IconComponent size={24} color={Colors.text.secondary} />
                  </View>

                  <View style={styles.relationshipInfo}>
                    <Text style={styles.relationshipTitle}>{relationship.title}</Text>
                    <Text style={styles.relationshipDescription}>
                      {relationship.description}
                    </Text>
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
  backButton: {
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
  relationshipsList: {
    gap: 16,
  },
  relationshipCard: {
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
  relationshipInfo: {
    flex: 1,
  },
  relationshipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  relationshipDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
