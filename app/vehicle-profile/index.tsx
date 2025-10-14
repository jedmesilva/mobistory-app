import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MessageCircle,
  FileText,
  Activity,
  Calendar,
  Users,
  Fuel,
  Car,
} from 'lucide-react-native';
import { Colors } from '@/constants';
import { FeedNavBottom, PostCard } from '@/components/feed';
import { OdometerIcon } from '@/components/icons';
import { VehicleHeader } from '@/components/ui';

export default function VehicleProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('profile');
  const [following, setFollowing] = useState(false);

  // Mock data - em produção virá da API ou do estado global
  const vehicle = {
    id: 1,
    name: 'Honda Civic XLI',
    plate: 'ABC-1234',
    color: 'Prata',
    year: 2019,
    odometer: 45230,
    fuelType: 'Gasolina',
  };

  const posts = [
    {
      id: 1,
      type: 'image' as const,
      userName: 'Carlos Silva',
      userRole: 'Condutor',
      date: '30 Set, 14:30',
      caption: 'Manhã de domingo com meu querido Civic! 🌅 Rodão impecável!',
      likes: 24,
      comments: 3,
      following: false,
      tags: [
        { icon: 'odometer' as const, label: 'Quilometragem', value: '45.230 km' },
        { icon: 'fuel' as const, label: 'Combustível', value: '60%' },
        { icon: 'userCheck' as const, label: 'Vínculo', value: 'Condutor' },
      ],
    },
    {
      id: 2,
      type: 'image' as const,
      userName: 'Ana Costa',
      userRole: 'Proprietária',
      date: '28 Set, 10:15',
      caption: 'Dia de manutenção preventiva! Carro sempre caprichado.',
      likes: 18,
      comments: 5,
      following: true,
      tags: [
        { icon: 'odometer' as const, label: 'Quilometragem', value: '44.690 km' },
        { icon: 'fuel' as const, label: 'Combustível', value: '45%' },
      ],
    },
    {
      id: 3,
      type: 'video' as const,
      userName: 'João Pereira',
      userRole: 'Proprietário',
      date: '25 Set, 18:40',
      caption: 'Abasteci no caminho pro trabalho. Consumo está ótimo!',
      likes: 12,
      comments: 2,
      following: false,
      tags: [
        { icon: 'odometer' as const, label: 'Quilometragem', value: '44.120 km' },
        { icon: 'fuel' as const, label: 'Combustível', value: 'Completo' },
      ],
    },
  ];

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
          vehicleName={vehicle.name}
          vehicleDetails={`${vehicle.plate} • ${vehicle.year}`}
          onVehiclePress={() => router.push('/vehicles-link-list')}
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
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
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

        {/* Seção de Momentos */}
        <View style={styles.momentsSection}>
          <View style={styles.momentsSectionHeader}>
            <Text style={styles.momentsSectionTitle}>Momentos do Veículo</Text>
            <Text style={styles.momentsSectionSubtitle}>
              {posts.length} publicações
            </Text>
          </View>

          {/* Lista de Momentos */}
          <View style={styles.momentsList}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Nav Bottom */}
      <FeedNavBottom
        translateY={0}
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
});
