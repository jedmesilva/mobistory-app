import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Car,
  MapPin,
  Fuel,
  Shield,
  ChevronRight,
  UserPlus,
  History,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  Download,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react-native';

interface Vehicle {
  marca: string;
  modelo: string;
  tipo: string;
  categoria: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: string;
  combustivel: string;
  seguro: string;
  localizacao: string;
  renavam: string;
  chassi: string;
  motor: string;
  paisOrigem: string;
  paisLicenciamento: string;
  anoModelo: number;
  anoFabricacao: number;
}

interface Document {
  id: number;
  name: string;
  type: string;
  fileType: string;
  size: string;
  uploadDate: string;
  url: string;
}

interface LinkedPerson {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  relationshipType: 'owner' | 'renter' | 'authorized_driver';
  status: 'active' | 'former';
  linkedDate: string;
  lastAccess: string;
}

interface PersonCardProps {
  person: LinkedPerson;
  onClick: (person: LinkedPerson) => void;
  isSelected: boolean;
  isHistorical?: boolean;
}

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [vehicle] = useState<Vehicle>({
    marca: 'Toyota',
    modelo: 'Corolla XEi',
    tipo: 'Carro',
    categoria: 'Sedan',
    ano: 2023,
    placa: 'ABC-1D23',
    cor: 'Prata',
    quilometragem: '15.420 km',
    combustivel: 'Flex',
    seguro: 'Porto Seguro',
    localizacao: 'São Paulo, SP',
    renavam: '12345678910',
    chassi: '9BWHE21JX24060831',
    motor: '1.8 16V',
    paisOrigem: 'Brasil',
    paisLicenciamento: 'Brasil',
    anoModelo: 2023,
    anoFabricacao: 2022,
  });

  const [documents] = useState<Document[]>([
    {
      id: 1,
      name: 'CRLV 2025',
      type: 'crlv',
      fileType: 'PDF',
      size: '2.4 MB',
      uploadDate: '10 Jan 2025',
      url: '#',
    },
    {
      id: 2,
      name: 'Nota Fiscal',
      type: 'invoice',
      fileType: 'PDF',
      size: '1.8 MB',
      uploadDate: '15 Dez 2022',
      url: '#',
    },
    {
      id: 3,
      name: 'Certificado de Garantia',
      type: 'warranty',
      fileType: 'PDF',
      size: '890 KB',
      uploadDate: '20 Dez 2022',
      url: '#',
    },
  ]);

  const [linkedPeople] = useState<LinkedPerson[]>([
    {
      id: 1,
      name: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      avatar: null,
      relationshipType: 'owner',
      status: 'active',
      linkedDate: '15 Jan 2023',
      lastAccess: '19 Set 2025',
    },
    {
      id: 2,
      name: 'João Carlos Oliveira',
      email: 'joao.carlos@email.com',
      avatar: null,
      relationshipType: 'authorized_driver',
      status: 'active',
      linkedDate: '10 Mar 2024',
      lastAccess: '18 Set 2025',
    },
    {
      id: 3,
      name: 'Ana Paula Costa',
      email: 'ana.costa@email.com',
      avatar: null,
      relationshipType: 'renter',
      status: 'active',
      linkedDate: '05 Set 2025',
      lastAccess: '20 Set 2025',
    },
    {
      id: 4,
      name: 'Pedro Henrique Lima',
      email: 'pedro.lima@email.com',
      avatar: null,
      relationshipType: 'authorized_driver',
      status: 'former',
      linkedDate: '20 Jun 2023',
      lastAccess: '15 Fev 2024',
    },
    {
      id: 5,
      name: 'Carla Fernandes',
      email: 'carla.fernandes@email.com',
      avatar: null,
      relationshipType: 'renter',
      status: 'former',
      linkedDate: '10 Dez 2023',
      lastAccess: '28 Abr 2024',
    },
  ]);

  const [selectedPerson, setSelectedPerson] = useState<LinkedPerson | null>(null);
  const [showHistoryFor, setShowHistoryFor] = useState<{ [key: string]: boolean }>({});
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [isDocumentationExpanded, setIsDocumentationExpanded] = useState(false);
  const [isOtherInfoExpanded, setIsOtherInfoExpanded] = useState(false);

  const owners = linkedPeople.filter((p) => p.relationshipType === 'owner' && p.status === 'active');
  const formerOwners = linkedPeople.filter((p) => p.relationshipType === 'owner' && p.status === 'former');
  const renters = linkedPeople.filter((p) => p.relationshipType === 'renter' && p.status === 'active');
  const formerRenters = linkedPeople.filter((p) => p.relationshipType === 'renter' && p.status === 'former');
  const authorizedDrivers = linkedPeople.filter((p) => p.relationshipType === 'authorized_driver' && p.status === 'active');
  const formerAuthorizedDrivers = linkedPeople.filter((p) => p.relationshipType === 'authorized_driver' && p.status === 'former');

  const relationshipConfig = {
    owner: { label: 'Proprietário', badge: { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' } },
    renter: { label: 'Locatário', badge: { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' } },
    authorized_driver: { label: 'Condutor', badge: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' } },
  };

  const toggleHistory = (type: string) => {
    setShowHistoryFor((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const maskData = (data: string, visibleChars = 4) => {
    if (!data) return '';
    return '•'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
  };

  const PersonCard = ({ person, onClick, isSelected, isHistorical = false }: PersonCardProps) => {
    const config = relationshipConfig[person.relationshipType];
    const initials = person.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <TouchableOpacity
        onPress={() => onClick(person)}
        style={[
          styles.personCard,
          isSelected && styles.personCardSelected,
          isHistorical && styles.personCardHistorical,
        ]}
      >
        <View style={styles.personCardHeader}>
          <View style={styles.personCardLeft}>
            <View style={[styles.personAvatar, isHistorical && styles.personAvatarHistorical]}>
              <Text style={styles.personAvatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={[styles.personName, isHistorical && styles.personNameHistorical]}>
                {person.name}
              </Text>
              <Text style={styles.personEmail}>{person.email}</Text>
            </View>
          </View>
          <View style={styles.personCardRight}>
            <View
              style={[
                styles.personBadge,
                {
                  backgroundColor: isHistorical ? '#f3f4f6' : config.badge.bg,
                  borderColor: isHistorical ? '#e5e7eb' : config.badge.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.personBadgeText,
                  { color: isHistorical ? '#6b7280' : config.badge.text },
                ]}
              >
                {config.label}
              </Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </View>
        </View>
        <View style={styles.personCardFooter}>
          <View style={styles.personCardFooterItem}>
            <Text style={styles.personCardFooterLabel}>Vinculado em</Text>
            <Text style={[styles.personCardFooterValue, isHistorical && styles.personCardFooterValueHistorical]}>
              {person.linkedDate}
            </Text>
          </View>
          <View style={styles.personCardFooterItem}>
            <Text style={styles.personCardFooterLabel}>Último acesso</Text>
            <Text style={[styles.personCardFooterValue, isHistorical && styles.personCardFooterValueHistorical]}>
              {person.lastAccess}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            shadowOpacity: headerOpacity,
            borderBottomWidth: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#4b5563" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {vehicle.marca} {vehicle.modelo}
          </Text>
          <Text style={styles.headerSubtitle}>
            {showSensitiveData ? vehicle.placa : maskData(vehicle.placa, 2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowSensitiveData(!showSensitiveData)}
        >
          {showSensitiveData ? <EyeOff size={20} color="#4b5563" /> : <Eye size={20} color="#4b5563" />}
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {/* Informações do Veículo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={20} color="#374151" />
            <Text style={styles.sectionTitle}>Informações do Veículo</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Placa</Text>
                <Text style={styles.gridValueBold}>
                  {showSensitiveData ? vehicle.placa : maskData(vehicle.placa, 2)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Ano</Text>
                <Text style={styles.gridValue}>{vehicle.ano}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Marca</Text>
                <Text style={styles.gridValue}>{vehicle.marca}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Modelo</Text>
                <Text style={styles.gridValue}>{vehicle.modelo}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Cor</Text>
                <Text style={styles.gridValue}>{vehicle.cor}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Tipo</Text>
                <Text style={styles.gridValue}>{vehicle.tipo}</Text>
              </View>
              <View style={[styles.gridItem, styles.gridItemFull]}>
                <Text style={styles.gridLabel}>Categoria</Text>
                <Text style={styles.gridValue}>{vehicle.categoria}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Documentação */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.sectionHeaderCollapsible,
              isDocumentationExpanded && styles.sectionHeaderCollapsibleExpanded,
            ]}
            onPress={() => setIsDocumentationExpanded(!isDocumentationExpanded)}
          >
            <View style={styles.sectionHeaderLeft}>
              <FileText size={20} color="#374151" />
              <Text style={styles.sectionTitle}>Documentação</Text>
            </View>
            <View style={styles.chevronContainer}>
              {isDocumentationExpanded ? (
                <ChevronUp size={20} color="#9ca3af" />
              ) : (
                <ChevronDown size={20} color="#9ca3af" />
              )}
            </View>
          </TouchableOpacity>
          {isDocumentationExpanded && (
            <View style={styles.sectionContent}>
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>RENAVAM</Text>
                  <Text style={styles.infoValueMono}>
                    {showSensitiveData ? vehicle.renavam : maskData(vehicle.renavam)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Chassi</Text>
                  <Text style={styles.infoValueMono}>
                    {showSensitiveData ? vehicle.chassi : maskData(vehicle.chassi, 4)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Motor</Text>
                  <Text style={styles.infoValue}>{vehicle.motor}</Text>
                </View>
                <View style={styles.infoGrid}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Ano Fabricação</Text>
                    <Text style={styles.gridValue}>{vehicle.anoFabricacao}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Ano Modelo</Text>
                    <Text style={styles.gridValue}>{vehicle.anoModelo}</Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>País de Origem</Text>
                  <Text style={styles.infoValue}>{vehicle.paisOrigem}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>País de Licenciamento</Text>
                  <Text style={styles.infoValue}>{vehicle.paisLicenciamento}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.documentsSection}>
                <View style={styles.documentsHeader}>
                  <Text style={styles.documentsTitle}>Documentos Anexados</Text>
                  <TouchableOpacity style={styles.uploadButton}>
                    <Upload size={16} color="#fff" />
                    <Text style={styles.uploadButtonText}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.documentsList}>
                  {documents.map((doc) => (
                    <View key={doc.id} style={styles.documentItem}>
                      <View style={styles.documentLeft}>
                        <View style={styles.documentIcon}>
                          <FileText size={20} color="#374151" />
                        </View>
                        <View style={styles.documentInfo}>
                          <Text style={styles.documentName} numberOfLines={1}>
                            {doc.name}
                          </Text>
                          <View style={styles.documentMeta}>
                            <Text style={styles.documentMetaText}>{doc.fileType}</Text>
                            <Text style={styles.documentMetaText}>•</Text>
                            <Text style={styles.documentMetaText}>{doc.size}</Text>
                            <Text style={styles.documentMetaText}>•</Text>
                            <Text style={styles.documentMetaText}>{doc.uploadDate}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.documentActions}>
                        <TouchableOpacity style={styles.documentActionButton}>
                          <Eye size={16} color="#4b5563" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.documentActionButton}>
                          <Download size={16} color="#4b5563" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Outras Informações */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.sectionHeaderCollapsible,
              isOtherInfoExpanded && styles.sectionHeaderCollapsibleExpanded,
            ]}
            onPress={() => setIsOtherInfoExpanded(!isOtherInfoExpanded)}
          >
            <View style={styles.sectionHeaderLeft}>
              <Car size={20} color="#374151" />
              <Text style={styles.sectionTitle}>Outras Informações</Text>
            </View>
            <View style={styles.chevronContainer}>
              {isOtherInfoExpanded ? (
                <ChevronUp size={20} color="#9ca3af" />
              ) : (
                <ChevronDown size={20} color="#9ca3af" />
              )}
            </View>
          </TouchableOpacity>
          {isOtherInfoExpanded && (
            <View style={styles.sectionContent}>
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Combustível</Text>
                  <Text style={styles.infoValue}>{vehicle.combustivel}</Text>
                </View>
                <View style={styles.tireInfo}>
                  <Text style={styles.tireInfoTitle}>Calibragem dos Pneus</Text>
                  <View style={styles.tireGrid}>
                    <View style={styles.tireItem}>
                      <Text style={styles.tireLabel}>Dianteiros</Text>
                      <Text style={styles.tireValue}>32 PSI</Text>
                    </View>
                    <View style={styles.tireItem}>
                      <Text style={styles.tireLabel}>Traseiros</Text>
                      <Text style={styles.tireValue}>32 PSI</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Capacidade do Tanque</Text>
                  <Text style={styles.infoValue}>50 L</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Óleo do Motor</Text>
                  <Text style={styles.infoValue}>5W-30</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Capacidade de Óleo</Text>
                  <Text style={styles.infoValue}>4.2 L</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Vínculos */}
        <View style={styles.linksHeader}>
          <View style={styles.linksHeaderLeft}>
            <Text style={styles.linksTitle}>Vínculos</Text>
            <Text style={styles.linksCount}>
              {owners.length + renters.length + authorizedDrivers.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.newLinkButton}>
            <UserPlus size={16} color="#fff" />
            <Text style={styles.newLinkButtonText}>Novo vínculo</Text>
          </TouchableOpacity>
        </View>

        {/* Proprietários */}
        {(owners.length > 0 || formerOwners.length > 0) && (
          <View style={styles.linkSection}>
            <View style={styles.linkSectionHeader}>
              <Text style={styles.linkSectionTitle}>Proprietários ({owners.length})</Text>
              {formerOwners.length > 0 && (
                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => toggleHistory('owner')}
                >
                  <History size={16} color="#6b7280" />
                  <Text style={styles.historyButtonText}>Anteriores ({formerOwners.length})</Text>
                  {showHistoryFor.owner ? (
                    <ChevronUp size={16} color="#6b7280" />
                  ) : (
                    <ChevronDown size={16} color="#6b7280" />
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.linkList}>
              {owners.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onClick={setSelectedPerson}
                  isSelected={selectedPerson?.id === person.id}
                />
              ))}
              {showHistoryFor.owner &&
                formerOwners.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onClick={setSelectedPerson}
                    isSelected={selectedPerson?.id === person.id}
                    isHistorical={true}
                  />
                ))}
            </View>
          </View>
        )}

        {/* Locatários */}
        {(renters.length > 0 || formerRenters.length > 0) && (
          <View style={styles.linkSection}>
            <View style={styles.linkSectionHeader}>
              <Text style={styles.linkSectionTitle}>Locatários ({renters.length})</Text>
              {formerRenters.length > 0 && (
                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => toggleHistory('renter')}
                >
                  <History size={16} color="#6b7280" />
                  <Text style={styles.historyButtonText}>Anteriores ({formerRenters.length})</Text>
                  {showHistoryFor.renter ? (
                    <ChevronUp size={16} color="#6b7280" />
                  ) : (
                    <ChevronDown size={16} color="#6b7280" />
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.linkList}>
              {renters.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onClick={setSelectedPerson}
                  isSelected={selectedPerson?.id === person.id}
                />
              ))}
              {showHistoryFor.renter &&
                formerRenters.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onClick={setSelectedPerson}
                    isSelected={selectedPerson?.id === person.id}
                    isHistorical={true}
                  />
                ))}
            </View>
          </View>
        )}

        {/* Condutores */}
        {(authorizedDrivers.length > 0 || formerAuthorizedDrivers.length > 0) && (
          <View style={styles.linkSection}>
            <View style={styles.linkSectionHeader}>
              <Text style={styles.linkSectionTitle}>Condutores ({authorizedDrivers.length})</Text>
              {formerAuthorizedDrivers.length > 0 && (
                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => toggleHistory('authorized_driver')}
                >
                  <History size={16} color="#6b7280" />
                  <Text style={styles.historyButtonText}>
                    Anteriores ({formerAuthorizedDrivers.length})
                  </Text>
                  {showHistoryFor.authorized_driver ? (
                    <ChevronUp size={16} color="#6b7280" />
                  ) : (
                    <ChevronDown size={16} color="#6b7280" />
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.linkList}>
              {authorizedDrivers.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onClick={setSelectedPerson}
                  isSelected={selectedPerson?.id === person.id}
                />
              ))}
              {showHistoryFor.authorized_driver &&
                formerAuthorizedDrivers.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onClick={setSelectedPerson}
                    isSelected={selectedPerson?.id === person.id}
                    isHistorical={true}
                  />
                ))}
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeaderCollapsible: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  sectionHeaderCollapsibleExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronContainer: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  gridItemFull: {
    width: '100%',
  },
  gridLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  gridValueBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  infoValueMono: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  tireInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  tireInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  tireGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tireItem: {
    flex: 1,
  },
  tireLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  tireValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  documentsSection: {
    marginTop: 0,
  },
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  documentMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  documentActionButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  linksHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  linksCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  newLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  newLinkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  linkSection: {
    marginBottom: 24,
  },
  linkSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  linkSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  linkList: {
    gap: 12,
  },
  personCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  personCardSelected: {
    borderColor: '#1f2937',
  },
  personCardHistorical: {
    opacity: 0.6,
  },
  personCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  personCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  personAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personAvatarHistorical: {
    backgroundColor: '#9ca3af',
  },
  personAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  personNameHistorical: {
    color: '#6b7280',
  },
  personEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  personCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  personBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  personCardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  personCardFooterItem: {
    flex: 1,
  },
  personCardFooterLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  personCardFooterValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  personCardFooterValueHistorical: {
    color: '#6b7280',
  },
});
