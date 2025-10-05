import { useRouter } from 'expo-router'; // Adicione esta importação
import { StatusBar } from 'expo-status-bar';
import { Bell, Car, ChevronDown, ChevronRight, ChevronUp, Clock, Menu, Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter(); // Adicione o hook do router
  
  const [vehicles] = useState([
    {
      id: 1,
      name: 'Honda Civic',
      model: 'XLI',
      plate: 'ABC-1234',
      color: 'Prata',
      year: 2018,
      relationshipType: 'owner',
      status: 'active',
      relationshipStart: '12 Jan 2018',
      lastEvent: '19 Set 2025'
    },
    {
      id: 2,
      name: 'Toyota Corolla',
      model: 'GLI',
      plate: 'DEF-5678',
      color: 'Branco',
      year: 2020,
      relationshipType: 'owner',
      status: 'active',
      relationshipStart: '05 Mar 2020',
      lastEvent: '15 Set 2025'
    },
    {
      id: 3,
      name: 'Volkswagen Gol',
      model: 'G4',
      plate: 'GHI-9012',
      color: 'Azul',
      year: 2015,
      relationshipType: 'renter',
      status: 'active',
      relationshipStart: '01 Ago 2024',
      lastEvent: '10 Set 2025'
    },
    {
      id: 4,
      name: 'Ford Ka',
      model: 'SE Plus',
      plate: 'JKL-3456',
      color: 'Vermelho',
      year: 2019,
      relationshipType: 'authorized_driver',
      status: 'active',
      relationshipStart: '15 Mai 2023',
      lastEvent: '22 Set 2025'
    },
    {
      id: 5,
      name: 'Fiat Uno',
      model: 'Mille',
      plate: 'PQR-1122',
      color: 'Branco',
      year: 2014,
      relationshipType: 'owner',
      status: 'former',
      relationshipStart: '10 Fev 2014',
      lastEvent: '12 Jun 2025'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [showHistoryFor, setShowHistoryFor] = useState<{[key: string]: boolean}>({});

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ownedVehicles = filteredVehicles.filter(v => v.relationshipType === 'owner' && v.status === 'active');
  const formerOwnedVehicles = filteredVehicles.filter(v => v.relationshipType === 'owner' && v.status === 'former');
  const rentedVehicles = filteredVehicles.filter(v => v.relationshipType === 'renter' && v.status === 'active');
  const authorizedDriverVehicles = filteredVehicles.filter(v => v.relationshipType === 'authorized_driver' && v.status === 'active');

  const relationshipConfig: {[key: string]: any} = {
    owner: { label: 'Proprietário' },
    renter: { label: 'Locatário' },
    authorized_driver: { label: 'Condutor' }
  };

  const toggleHistory = (relationshipType: string) => {
    setShowHistoryFor(prev => ({
      ...prev,
      [relationshipType]: !prev[relationshipType]
    }));
  };

  // Função para navegar para a tela de histórico
  const navigateToVehicleHistory = (vehicle: any) => {
    router.push({
      pathname: '/vehicle-history/[id]',
      params: {
        id: vehicle.id,
        name: vehicle.name,
        model: vehicle.model,
        plate: vehicle.plate,
        year: vehicle.year,
        color: vehicle.color
      }
    });
  };

  const VehicleCard = ({ vehicle, isHistorical = false }: any) => {
    const config = relationshipConfig[vehicle.relationshipType];
    const isSelected = selectedVehicle === vehicle.id;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedVehicle(vehicle.id);
          // Navega após um pequeno delay para mostrar a seleção
          setTimeout(() => navigateToVehicleHistory(vehicle), 150);
        }}
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          isHistorical && styles.cardHistorical
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          <View style={[styles.iconBox, isHistorical && styles.iconBoxHistorical]}>
            <Car size={28} color="#fff" />
          </View>

          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, isHistorical && styles.textHistorical]}>
              {vehicle.name} {vehicle.model}
            </Text>
            
            <Text style={styles.cardSubtitle}>
              {vehicle.plate} • {vehicle.color} • {vehicle.year}
            </Text>

            <View style={[styles.badge, isHistorical && styles.badgeHistorical]}>
              <Text style={[styles.badgeText, isHistorical && styles.badgeTextHistorical]}>
                {config.label}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>INÍCIO</Text>
                <Text style={[styles.footerValue, isHistorical && styles.textHistorical]}>
                  {vehicle.relationshipStart}
                </Text>
              </View>
              
              <View style={styles.footerItem}>
                <Text style={[styles.footerLabel, styles.footerLabelRight]}>ÚLTIMO EVENTO</Text>
                <Text style={[styles.footerValue, styles.footerValueRight, isHistorical && styles.textHistorical]}>
                  {vehicle.lastEvent}
                </Text>
              </View>
            </View>
          </View>

          <ChevronRight 
            size={20} 
            color={isHistorical ? "#9ca3af" : "#6b7280"} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  const SectionHeader = ({ title, count, historicalCount, relationshipType }: any) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>
          {count} {count === 1 ? 'veículo ativo' : 'veículos ativos'}
        </Text>
      </View>
      {historicalCount > 0 && (
        <TouchableOpacity
          onPress={() => toggleHistory(relationshipType)}
          style={styles.historyButton}
        >
          <Clock size={16} color="#4b5563" />
          <Text style={styles.historyButtonText}>
            Histórico ({historicalCount})
          </Text>
          {showHistoryFor[relationshipType] ? (
            <ChevronUp size={16} color="#4b5563" />
          ) : (
            <ChevronDown size={16} color="#4b5563" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Menu size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Meus Vínculos</Text>
        
        <TouchableOpacity style={styles.headerButton}>
          <Bell size={24} color="#374151" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por modelo, placa ou cor..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {filteredVehicles.length === 0 && searchTerm ? (
            /* Empty State */
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Search size={40} color="#9ca3af" />
              </View>
              <Text style={styles.emptyStateTitle}>Nenhum veículo encontrado</Text>
              <Text style={styles.emptyStateSubtitle}>
                Tente buscar com outros termos ou adicione um novo veículo.
              </Text>
            </View>
          ) : (
            <>
              {/* Proprietário */}
              {ownedVehicles.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Proprietário"
                    count={ownedVehicles.length}
                    historicalCount={formerOwnedVehicles.length}
                    relationshipType="owner"
                  />
                  {ownedVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                  {showHistoryFor.owner && (
                    <>
                      <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Histórico</Text>
                        <View style={styles.dividerLine} />
                      </View>
                      {formerOwnedVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} isHistorical={true} />
                      ))}
                    </>
                  )}
                </View>
              )}

              {/* Locatário */}
              {rentedVehicles.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Locatário"
                    count={rentedVehicles.length}
                    historicalCount={0}
                    relationshipType="renter"
                  />
                  {rentedVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </View>
              )}

              {/* Condutor */}
              {authorizedDriverVehicles.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader
                    title="Condutor"
                    count={authorizedDriverVehicles.length}
                    historicalCount={0}
                    relationshipType="authorized_driver"
                  />
                  {authorizedDriverVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </View>
              )}

              {/* Add Vehicle Button */}
              <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                <View style={styles.addButtonIcon}>
                  <Plus size={24} color="#fff" />
                </View>
                <View style={styles.addButtonTextContainer}>
                  <Text style={styles.addButtonTitle}>Adicionar Veículo</Text>
                  <Text style={styles.addButtonSubtitle}>Registre um novo vínculo</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerButton: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    padding: 16,
  },
  cardSelected: {
    borderColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHistorical: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxHistorical: {
    backgroundColor: '#9ca3af',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeHistorical: {
    backgroundColor: '#f3f4f6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  badgeTextHistorical: {
    color: '#6b7280',
  },
  textHistorical: {
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 16,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  footerLabelRight: {
    textAlign: 'right',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  footerValueRight: {
    textAlign: 'right',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginHorizontal: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 16,
    gap: 16,
  },
  addButtonIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonTextContainer: {
    flex: 1,
  },
  addButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButtonSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});