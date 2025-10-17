import React, { useState, useMemo, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  MessageCircle,
  FileText,
  Activity,
  Calendar,
  Users,
  Fuel,
  Car,
  ChevronDown,
  ChevronUp,
  Droplet,
  CircleDot,
} from 'lucide-react-native';
import { Colors } from '@/constants';
import { FeedNavBottom, PostCard } from '@/components/feed';
import { OdometerIcon } from '@/components/icons';
import { VehicleHeader } from '@/components/ui';
import { useEntityVehicles } from '@/hooks/entity';
import { useVehicleMoments } from '@/hooks/moment';

export default function VehicleProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('profile');
  const [following, setFollowing] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Static animated values (no animation in this screen)
  const navBottomTranslateY = useRef(new Animated.Value(0)).current;
  const navBottomOpacity = useRef(new Animated.Value(1)).current;

  // TODO: Get entity_id from auth session
  // For now, using the first entity from seed data
  const TEMP_ENTITY_ID = '123e4567-e89b-12d3-a456-426614174000';

  const { vehicleLinks, loading: vehiclesLoading } = useEntityVehicles(TEMP_ENTITY_ID);

  // Get the selected vehicle by ID from params, or use the first vehicle
  const selectedVehicleId = params.vehicleId;
  const vehicleLink = selectedVehicleId
    ? vehicleLinks.find(link => link.vehicles.id === selectedVehicleId) || vehicleLinks[0]
    : vehicleLinks[0];
  const vehicleData = vehicleLink?.vehicles;

  // Fetch moments for this vehicle
  const { moments, loading: momentsLoading } = useVehicleMoments(vehicleData?.id);

  // Transform vehicle data for display
  const vehicle = useMemo(() => {
    if (!vehicleData) {
      return {
        id: '',
        name: '',
        brand: '',
        model: '',
        plate: '',
        color: '',
        year: 0,
        odometer: 0,
        fuelType: '',
      };
    }

    const activePlate = vehicleData.plates?.find(p => p.active) || vehicleData.plates?.[0];
    const activeColor = vehicleData.colors?.find(c => c.active) || vehicleData.colors?.[0];
    const activeFuel = vehicleData.vehicle_fuels?.find(f => f.active) || vehicleData.vehicle_fuels?.[0];

    return {
      id: vehicleData.id,
      name: vehicleData.models.model,
      brand: vehicleData.brands.brand,
      model: vehicleData.model_versions?.version || '',
      plate: activePlate?.plate || '',
      color: activeColor?.color || '',
      year: vehicleData.model_year || 0,
      odometer: 0, // TODO: Get from vehicle_odometer_readings table
      fuelType: activeFuel?.fuels.name || '',
    };
  }, [vehicleData]);

  // Transform moments data to posts format
  const posts = useMemo(() => moments.map((moment) => {
    const activePlate = moment.vehicles.plates?.find(p => p.active) || moment.vehicles.plates?.[0];
    const vehicleName = `${moment.vehicles.brands.brand} ${moment.vehicles.models.model}`;

    return {
      id: parseInt(moment.id.slice(0, 8), 16),
      type: moment.type as 'image' | 'video',
      userName: moment.entities.name,
      userRole: 'Condutor', // TODO: Get from relationship type
      vehicleName,
      vehiclePlate: activePlate?.plate || '',
      date: new Date(moment.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      caption: moment.caption || '',
      imageUrl: moment.moment_images[0]?.image_url,
      likes: moment.moment_reactions.length,
      comments: moment.moment_comments.length,
      following: false,
      tags: moment.tags as any || [],
    };
  }), [moments]);

  const handleTabChange = (tab: 'home' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.push('/feed');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <SafeAreaView edges={['top']}>
        <VehicleHeader
          vehicleName={`${vehicle.brand} ${vehicle.name} ${vehicle.model}`}
          vehicleDetails={`${vehicle.plate} • ${vehicle.year}`}
          onVehiclePress={() => router.push({
            pathname: '/vehicles-link-list',
            params: { from: 'vehicle-profile' }
          })}
          rightButton={
            <TouchableOpacity
              style={styles.headerMessageButton}
              onPress={() => router.push({
                pathname: '/conversations/[id]',
                params: {
                  id: vehicle.id,
                  name: vehicle.name,
                  plate: vehicle.plate,
                  year: vehicle.year,
                  color: vehicle.color
                }
              })}
            >
              <MessageCircle size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          }
        />
      </SafeAreaView>

      {/* Conteúdo */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagem do Veículo */}
        <View style={styles.vehicleImageContainer}>
          <Car size={64} color={Colors.text.secondary} />
        </View>

        {/* Informações e Botão Seguir */}
        <View style={styles.vehicleInfoSection}>
          <View style={styles.vehicleInfoHeader}>
            <View style={styles.vehicleInfoLeft}>
              <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.name} {vehicle.model}</Text>
              <Text style={styles.vehicleDetails}>
                {vehicle.plate} • {vehicle.color}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setFollowing(!following)}
              style={[
                styles.followButton,
                following && styles.followButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.followButtonText,
                  following && styles.followButtonTextActive,
                ]}
              >
                {following ? 'Seguindo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dados do Veículo */}
          <View style={styles.vehicleStats}>
            <View style={styles.vehicleStat}>
              <Calendar size={16} color={Colors.text.secondary} />
              <Text style={styles.vehicleStatText}>{vehicle.year}</Text>
            </View>
            <Text style={styles.vehicleStatSeparator}>•</Text>
            <View style={styles.vehicleStat}>
              <OdometerIcon size={14} color={Colors.text.secondary} />
              <Text style={styles.vehicleStatText}>
                {vehicle.odometer.toLocaleString()} km
              </Text>
            </View>
            <Text style={styles.vehicleStatSeparator}>•</Text>
            <View style={styles.vehicleStat}>
              <Fuel size={16} color={Colors.text.secondary} />
              <Text style={styles.vehicleStatText}>{vehicle.fuelType}</Text>
            </View>
          </View>
        </View>

        {/* Seção de Botões */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/vehicle-history/[id]',
              params: {
                id: vehicle.id,
                name: vehicle.name,
                plate: vehicle.plate,
                year: vehicle.year,
                color: vehicle.color
              }
            })}
          >
            <View style={styles.actionButtonIcon}>
              <Activity size={20} color={Colors.text.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Atividades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/vehicle-details/[id]',
              params: {
                id: vehicle.id
              }
            })}
          >
            <View style={styles.actionButtonIcon}>
              <FileText size={20} color={Colors.text.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/vehicle-links/[id]',
              params: {
                id: vehicle.id,
                name: vehicle.name,
                model: 'XLI',
                plate: vehicle.plate,
                year: vehicle.year,
                color: vehicle.color
              }
            })}
          >
            <View style={styles.actionButtonIcon}>
              <Users size={20} color={Colors.text.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Vínculos</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Mais Opções */}
        <View style={styles.moreOptionsSection}>
          <TouchableOpacity
            style={styles.moreOptionsButton}
            onPress={() => setShowMoreOptions(!showMoreOptions)}
          >
            <Text style={styles.moreOptionsButtonText}>
              {showMoreOptions ? 'Menos opções' : 'Mais opções'}
            </Text>
            {showMoreOptions ? (
              <ChevronUp size={20} color={Colors.text.secondary} />
            ) : (
              <ChevronDown size={20} color={Colors.text.secondary} />
            )}
          </TouchableOpacity>

          {/* Opções Expandidas */}
          {showMoreOptions && (
            <View style={styles.expandedOptionsGrid}>
              <TouchableOpacity
                style={styles.expandedOptionCard}
                onPress={() => router.push({
                  pathname: '/fuel-history/[id]',
                  params: { id: vehicle.id }
                })}
              >
                <View style={styles.expandedOptionIcon}>
                  <Fuel size={20} color={Colors.text.secondary} />
                </View>
                <Text style={styles.expandedOptionText}>Abastecimentos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.expandedOptionCard}
                onPress={() => console.log('Histórico de Óleo')}
              >
                <View style={styles.expandedOptionIcon}>
                  <Droplet size={20} color={Colors.text.secondary} />
                </View>
                <Text style={styles.expandedOptionText}>Óleo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.expandedOptionCard}
                onPress={() => console.log('Histórico de Pneus')}
              >
                <View style={styles.expandedOptionIcon}>
                  <CircleDot size={20} color={Colors.text.secondary} />
                </View>
                <Text style={styles.expandedOptionText}>Pneus</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Seção de Momentos */}
        <View style={styles.momentsSection}>
          <View style={styles.momentsSectionHeader}>
            <Text style={styles.momentsSectionTitle}>Momentos do Veículo</Text>
            {!momentsLoading && (
              <Text style={styles.momentsSectionSubtitle}>
                {posts.length} publicações
              </Text>
            )}
          </View>

          {/* Loading State */}
          {momentsLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
              <Text style={styles.loadingText}>Carregando momentos...</Text>
            </View>
          )}

          {/* Lista de Momentos */}
          {!momentsLoading && posts.length > 0 && (
            <View style={styles.momentsList}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </View>
          )}

          {/* Empty State */}
          {!momentsLoading && posts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum momento publicado ainda.</Text>
              <Text style={styles.emptyStateSubtext}>Seja o primeiro a compartilhar!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Nav Bottom */}
      <FeedNavBottom
        translateY={navBottomTranslateY}
        opacity={navBottomOpacity}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  headerMessageButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  vehicleImageContainer: {
    width: '100%',
    height: 192,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    alignSelf: 'center',
    maxWidth: '92%',
  },
  vehicleInfoSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  vehicleInfoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vehicleInfoLeft: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.text.primary,
    borderRadius: 12,
    marginLeft: 12,
  },
  followButtonActive: {
    backgroundColor: Colors.background.secondary,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  followButtonTextActive: {
    color: Colors.text.secondary,
  },
  vehicleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleStatText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  vehicleStatSeparator: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
  },
  actionButtonIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  moreOptionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  moreOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  moreOptionsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  expandedOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  expandedOptionCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  expandedOptionIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  momentsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
    paddingTop: 16,
  },
  momentsSectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  momentsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  momentsSectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  momentsList: {
    gap: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});
