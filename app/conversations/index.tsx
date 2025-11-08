import { SimpleHeader } from '@/components/ui';
import { Colors } from '@/constants';
import { useAuthEntity } from '@/contexts';
import { useConversations } from '@/lib/api/hooks';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Car, ChevronRight } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConversationsScreen() {
  const router = useRouter();
  const { entityId, loading: entityLoading } = useAuthEntity();
  const { conversations, loading: conversationsLoading } = useConversations(entityId);

  // Transform conversations to display format
  const vehicles = useMemo(() => {
    return conversations
      .filter(conversation => conversation.primary_vehicle_id && conversation.primary_vehicle) // Apenas conversas com veículo
      .map((conversation) => {
        const vehicle = conversation.primary_vehicle;

        // Buscar marca e modelo
        const brandName = vehicle?.brand?.name || vehicle?.custom_brand || '';
        const modelName = vehicle?.model?.name || vehicle?.custom_model || '';
        const versionName = vehicle?.version?.name || vehicle?.custom_version || '';

        // Buscar placa ativa
        const activePlate = vehicle?.plates?.find((p: any) => p.status === 'active') || vehicle?.plates?.[0];
        const plateNumber = activePlate?.plate_number || vehicle?.current_plate || '';

        // Buscar cor primária
        const primaryColor = vehicle?.vehicle_colors?.find((c: any) => c.is_primary) || vehicle?.vehicle_colors?.[0];
        const colorName = primaryColor?.color || vehicle?.current_color || '';

        // Nome do veículo
        const vehicleName = `${brandName} ${modelName} ${versionName}`.trim() || conversation.title || 'Veículo sem identificação';

        return {
          vehicleId: conversation.primary_vehicle_id!,
          conversationId: conversation.id,
          name: vehicleName,
          model: versionName,
          plate: plateNumber || 'Sem placa',
          year: vehicle?.model_year || vehicle?.manufacturing_year || 0,
          color: colorName || 'Sem cor',
        };
      });
  }, [conversations]);

  const handleVehiclePress = (vehicleId: string) => {
    router.push({
      pathname: '/conversations/[id]',
      params: {
        id: vehicleId, // Passa o vehicleId para a tela de conversa
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
              Você ainda não tem conversas para visualizar
            </Text>
          </View>
        ) : (
          /* Lista de Conversas */
          <View style={styles.vehiclesList}>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.conversationId}
                style={styles.vehicleCard}
                onPress={() => handleVehiclePress(vehicle.vehicleId)}
                activeOpacity={0.7}
              >
                <View style={styles.vehicleCardLeft}>
                  <View style={styles.vehicleIcon}>
                    <Car size={24} color={Colors.text.secondary} />
                  </View>

                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                      {vehicle.name}
                    </Text>
                    <Text style={styles.vehicleDetails}>
                      {vehicle.plate} • {vehicle.year > 0 ? vehicle.year : 'Sem ano'} • {vehicle.color}
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
