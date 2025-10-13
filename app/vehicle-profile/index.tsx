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
  Car,
  MessageCircle,
  FileText,
  Activity,
  Calendar,
  Users,
  ChevronDown,
  Fuel,
} from 'lucide-react-native';
import { Colors } from '@/constants';
import { FeedNavBottom } from '@/components/feed';
import { MomentCard, VehicleSelector, Vehicle } from '@/components/vehicle-profile';
import { OdometerIcon } from '@/components/icons';

export default function VehicleProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('profile');
  const [following, setFollowing] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  const [vehicles] = useState<Vehicle[]>([
    {
      id: 1,
      name: 'Honda Civic XLI',
      plate: 'ABC-1234',
      color: 'Prata',
      year: 2019,
      odometer: 45230,
      fuelType: 'Gasolina',
      status: 'active',
      lastEvent: '19 Set 2025',
    },
    {
      id: 2,
      name: 'Toyota Corolla GLI',
      plate: 'DEF-5678',
      color: 'Branco',
      year: 2020,
      odometer: 28450,
      fuelType: 'Flex',
      status: 'active',
      lastEvent: '15 Set 2025',
    },
    {
      id: 3,
      name: 'Volkswagen Gol',
      plate: 'GHI-9012',
      color: 'Azul',
      year: 2015,
      odometer: 89750,
      fuelType: 'Flex',
      status: 'sold',
      lastEvent: '10 Ago 2025',
    },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const vehicle = selectedVehicle;

  const moments = [
    {
      id: 1,
      type: 'image' as const,
      userName: 'Carlos Silva',
      userRole: 'Condutor',
      date: '30 Set, 14:30',
      caption: 'Manhã de domingo com meu querido Civic! 🌅 Rodão impecável!',
      likes: 24,
      comments: 3,
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

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleSelector(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerVehicle}
          onPress={() => setShowVehicleSelector(true)}
        >
          <View style={styles.headerVehicleIcon}>
            <Car size={20} color={Colors.text.secondary} />
          </View>
          <View style={styles.headerVehicleInfo}>
            <View style={styles.headerVehicleName}>
              <Text style={styles.headerVehicleNameText}>{vehicle.name}</Text>
              <ChevronDown
                size={16}
                color={Colors.text.secondary}
                style={[
                  styles.chevron,
                  showVehicleSelector && styles.chevronRotated,
                ]}
              />
            </View>
            <Text style={styles.headerVehicleDetails}>
              {vehicle.plate} • {vehicle.year}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerMessageButton}
          onPress={() => console.log('Abrir chat')}
        >
          <MessageCircle size={24} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Vehicle Selector */}
      <VehicleSelector
        visible={showVehicleSelector}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onSelect={handleVehicleSelect}
        onClose={() => setShowVehicleSelector(false)}
        onAddVehicle={() => {
          setShowVehicleSelector(false);
          router.push('/add-vehicle');
        }}
      />

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
            onPress={() => console.log('Atividades')}
          >
            <View style={styles.actionButtonIcon}>
              <Activity size={20} color={Colors.text.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Atividades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Dados do veículo')}
          >
            <View style={styles.actionButtonIcon}>
              <FileText size={20} color={Colors.text.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Vínculos')}
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
              {moments.length} publicações
            </Text>
          </View>

          {/* Lista de Momentos */}
          <View style={styles.momentsList}>
            {moments.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerVehicleIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerVehicleInfo: {
    flex: 1,
  },
  headerVehicleName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerVehicleNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  chevron: {
    transition: 'transform 0.2s',
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  headerVehicleDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerMessageButton: {
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
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
