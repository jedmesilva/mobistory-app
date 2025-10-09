import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Plus,
} from 'lucide-react-native';
import {
  ProgressIndicator,
  StationCard,
  SelectedStationCard,
  type Station,
} from '@/components/add-fueling';
import { SearchInput } from '@/components/ui';

export default function StationSelectionScreen() {
  const router = useRouter();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stationSearch, setStationSearch] = useState('');
  const [showStationSearch, setShowStationSearch] = useState(false);
  const [showAddStation, setShowAddStation] = useState(false);
  const [newStationForm, setNewStationForm] = useState({
    name: '',
    address: '',
  });
  const searchInputRef = useRef<TextInput>(null);

  const currentVehicle = {
    name: 'Honda Civic',
    year: '2020',
    plate: 'ABC-1234',
  };

  const savedStations: Station[] = [
    {
      id: 1,
      name: 'Shell Select',
      brand: 'Shell',
      address: 'Av. Paulista, 1500 - Bela Vista',
      distance: '0.8 km',
      isFavorite: true,
      lastVisit: '2024-09-15',
      prices: {
        gasolina_comum: '5.49',
        gasolina_aditivada: '5.69',
        etanol: '3.89',
        diesel: '5.99',
      },
    },
    {
      id: 2,
      name: 'Posto Ipiranga',
      brand: 'Ipiranga',
      address: 'R. Augusta, 2000 - Consolação',
      distance: '1.2 km',
      isFavorite: false,
      lastVisit: '2024-09-10',
      prices: {
        gasolina_comum: '5.45',
        gasolina_aditivada: '5.65',
        etanol: '3.85',
      },
    },
    {
      id: 3,
      name: 'BR Mania',
      brand: 'BR',
      address: 'Av. Rebouças, 800 - Pinheiros',
      distance: '2.1 km',
      isFavorite: true,
      lastVisit: '2024-09-08',
      prices: {
        gasolina_comum: '5.52',
        gasolina_aditivada: '5.72',
        etanol: '3.92',
        diesel: '6.05',
      },
    },
  ];

  const nearbyStations: Station[] = [
    {
      id: 4,
      name: 'Posto Ale',
      brand: 'Ale',
      address: 'R. da Consolação, 1200',
      distance: '0.5 km',
      isFavorite: false,
      prices: {
        gasolina_comum: '5.47',
        etanol: '3.87',
      },
    },
    {
      id: 5,
      name: 'Texaco Express',
      brand: 'Texaco',
      address: 'Av. São Luís, 500',
      distance: '1.5 km',
      isFavorite: false,
      prices: {
        gasolina_comum: '5.51',
        gasolina_aditivada: '5.71',
        etanol: '3.91',
      },
    },
  ];

  const filteredStations = () => {
    const allStations = [...savedStations, ...nearbyStations];
    if (!stationSearch.trim()) return allStations;

    return allStations.filter(
      (station) =>
        station.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
        station.brand.toLowerCase().includes(stationSearch.toLowerCase()) ||
        station.address.toLowerCase().includes(stationSearch.toLowerCase())
    );
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setShowStationSearch(false);
    setShowAddStation(false);
    setStationSearch('');
  };


  const clearSearch = () => {
    setStationSearch('');
    setShowStationSearch(false);
    setShowAddStation(false);
    searchInputRef.current?.blur();
  };

  const handleAddStation = () => {
    setShowAddStation(true);
    setShowStationSearch(false);
  };

  const handleSaveNewStation = () => {
    if (!newStationForm.name.trim()) {
      alert('Por favor, informe o nome do posto');
      return;
    }

    const newStation: Station = {
      id: Date.now(),
      name: newStationForm.name.trim(),
      brand: 'Personalizado',
      address: newStationForm.address.trim() || 'Endereço não informado',
      distance: 'N/A',
      isFavorite: false,
      isUserAdded: true,
      prices: {},
    };

    setSelectedStation(newStation);
    setNewStationForm({ name: '', address: '' });
    setShowAddStation(false);
    setStationSearch('');
  };

  const cancelAddStation = () => {
    setShowAddStation(false);
    setNewStationForm({ name: '', address: '' });
  };

  const handleContinue = () => {
    router.push('/add-fueling/fuel-input');
  };

  const favoriteStations = savedStations.filter((s) => s.isFavorite);
  const recentStations = savedStations.filter((s) => !s.isFavorite);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Selecionar Posto</Text>
          <Text style={styles.headerSubtitle}>
            {currentVehicle.name} • {currentVehicle.plate}
          </Text>
        </View>
        <ProgressIndicator currentStep={1} totalSteps={3} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.content}
          onPress={() => {
            if (showStationSearch) {
              searchInputRef.current?.blur();
            }
          }}
        >
          {/* Selected Station */}
          {selectedStation && (
            <SelectedStationCard
              station={selectedStation}
              onRemove={() => setSelectedStation(null)}
            />
          )}

          {/* Search Box */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.searchWrapper}>
              <SearchInput
                ref={searchInputRef}
                value={stationSearch}
                onChangeText={setStationSearch}
                onClear={clearSearch}
                onFocus={() => setShowStationSearch(true)}
                onBlur={() => {
                  // Pequeno delay para permitir cliques nos resultados
                  setTimeout(() => {
                    if (stationSearch === '') {
                      setShowStationSearch(false);
                    }
                  }, 150);
                }}
                placeholder="Buscar posto..."
              />
            </View>
          </Pressable>

          {/* Search Results */}
          {showStationSearch && (
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.searchResultsCard}>
                {filteredStations().slice(0, 8).map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    onPress={() => handleStationSelect(station)}
                  />
                ))}

                {filteredStations().length === 0 && (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsTitle}>Nenhum posto encontrado</Text>
                    <Text style={styles.noResultsSubtitle}>
                      Não encontrou o posto que procura?
                    </Text>
                    <TouchableOpacity onPress={handleAddStation} style={styles.addButton}>
                      <Plus size={16} color={Colors.background.primary} />
                      <Text style={styles.addButtonText}>Adicionar Posto Manualmente</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Pressable>
          )}

          {/* Add Station Form */}
          {showAddStation && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Plus size={16} color={Colors.text.secondary} />
                <Text style={styles.cardHeaderText}>Adicionar Novo Posto</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nome do Posto *</Text>
                  <TextInput
                    value={newStationForm.name}
                    onChangeText={(text) =>
                      setNewStationForm((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Ex: Shell da Esquina, Posto do João, etc."
                    placeholderTextColor={Colors.text.placeholder}                     style={styles.input}
                  />
                  <Text style={styles.hint}>
                    Pode ser o nome oficial ou um apelido que você usa
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Endereço ou Referência</Text>
                  <TextInput
                    value={newStationForm.address}
                    onChangeText={(text) =>
                      setNewStationForm((prev) => ({ ...prev, address: text }))
                    }
                    placeholder="Ex: Av. Paulista, 1000 ou próximo ao shopping"
                    placeholderTextColor={Colors.text.placeholder}                     style={styles.input}
                  />
                  <Text style={styles.hint}>
                    Endereço completo ou uma referência que te ajude a lembrar
                  </Text>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity onPress={handleSaveNewStation} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Adicionar Posto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cancelAddStation} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Stations Lists */}
          {!showStationSearch && !showAddStation && (
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Favorite Stations */}
              {favoriteStations.length > 0 && (
                <View style={styles.card}>
                  <View style={[styles.cardHeader, styles.sectionHeader]}>
                    <Star size={16} color="#eab308" fill="#eab308" />
                    <Text style={styles.sectionTitle}>Postos Favoritos</Text>
                  </View>

                  <View style={styles.stationsList}>
                    {favoriteStations.map((station) => (
                      <StationCard
                        key={station.id}
                        station={station}
                        onPress={() => handleStationSelect(station)}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Recent Stations */}
              {recentStations.length > 0 && (
                <View style={styles.card}>
                  <View style={[styles.cardHeader, styles.sectionHeader]}>
                    <Clock size={16} color={Colors.text.secondary} />
                    <Text style={styles.sectionTitle}>Postos Recentes</Text>
                  </View>

                  <View style={styles.stationsList}>
                    {recentStations.map((station) => (
                      <StationCard
                        key={station.id}
                        station={station}
                        onPress={() => handleStationSelect(station)}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Nearby Stations */}
              <View style={styles.card}>
                <View style={[styles.cardHeader, styles.sectionHeader]}>
                  <MapPin size={16} color={Colors.text.secondary} />
                  <Text style={styles.sectionTitle}>Postos Próximos</Text>
                </View>

                <View style={styles.stationsList}>
                  {nearbyStations.map((station) => (
                    <StationCard
                      key={station.id}
                      station={station}
                      onPress={() => handleStationSelect(station)}
                    />
                  ))}
                </View>
              </View>
            </Pressable>
          )}
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <View style={styles.footer}>
          {selectedStation ? (
            <View style={styles.footerActions}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedStation(null);
                  handleContinue();
                }}
                style={styles.skipButton}
              >
                <Text style={styles.skipButtonText}>Pular</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
                <Text style={styles.continueButtonText}>
                  Continuar com {selectedStation.name}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleContinue} style={styles.continueButtonFull}>
              <Text style={styles.continueButtonText}>Continuar sem Posto</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
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
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 160,
  },
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  sectionHeader: {
    backgroundColor: Colors.background.secondary,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  cardBody: {
    padding: 16,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  searchResultsCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noResultsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  noResultsSubtitle: {
    fontSize: 12,
    color: Colors.text.placeholder,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.background.primary,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.light,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.primary.dark,
  },
  hint: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  stationsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  continueButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  continueButtonFull: {
    paddingVertical: 16,
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 16,
    alignItems: 'center',
  },
});
