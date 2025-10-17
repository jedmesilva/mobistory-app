import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Car, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants';
import { SimpleHeader } from '@/components/ui';
import { useConversations } from '@/hooks/conversation';
import { useAuthEntity } from '@/contexts';

export default function ConversationsScreen() {
  const router = useRouter();
  const { entityId, loading: entityLoading } = useAuthEntity();
  const { conversations, loading: conversationsLoading } = useConversations(entityId);

  // Transform conversations to display format (mantendo estrutura original)
  const vehicles = useMemo(() => {
    return conversations.map((conversation) => {
      const vehicle = conversation.vehicles;
      const activePlate = vehicle.plates?.find(p => p.active) || vehicle.plates?.[0];
      const activeColor = vehicle.colors?.find(c => c.active) || vehicle.colors?.[0];

      return {
        id: vehicle.id,
        name: vehicle.models.model,
        model: vehicle.model_versions?.version || '',
        plate: activePlate?.plate || '',
        year: vehicle.model_year || 0,
        color: activeColor?.color || '',
      };
    });
  }, [conversations]);

  const handleVehiclePress = (vehicleId: string) => {
    router.push({
      pathname: '/conversations/[id]',
      params: {
        id: vehicleId,
      }
    });
  };

  // Loading state
  if (entityLoading || conversationsLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <SimpleHeader title="Conversas" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
          <Text style={styles.loadingText}>Carregando conversas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <SimpleHeader title="Conversas" />

      {/* Lista de Veículos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {vehicles.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Car size={48} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma conversa</Text>
            <Text style={styles.emptyStateSubtitle}>
              Você ainda não tem conversas com veículos
            </Text>
          </View>
        ) : (
          /* Lista de Veículos */
          <View style={styles.vehiclesList}>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => handleVehiclePress(vehicle.id)}
                activeOpacity={0.7}
              >
                <View style={styles.vehicleCardLeft}>
                  <View style={styles.vehicleIcon}>
                    <Car size={24} color={Colors.text.secondary} />
                  </View>

                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                      {vehicle.name} {vehicle.model}
                    </Text>
                    <Text style={styles.vehicleDetails}>
                      {vehicle.plate} • {vehicle.year} • {vehicle.color}
                    </Text>
                  </View>
                </View>

                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    backgroundColor: Colors.background.secondary,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  vehiclesList: {
    padding: 16,
    gap: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  vehicleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
