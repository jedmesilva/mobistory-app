import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Car,
  UserPlus,
  FileText,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react-native';
import {
  VehicleInfoSection,
  CollapsibleSection,
  DocumentItem,
  LinkSection,
  Document,
  LinkedPerson,
} from '../../components/vehicle-details';

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

  const toggleHistory = (type: string) => {
    setShowHistoryFor((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const maskData = (data: string, visibleChars = 4) => {
    if (!data) return '';
    return '•'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const vehicleInfoItems = [
    { label: 'Placa', value: showSensitiveData ? vehicle.placa : maskData(vehicle.placa, 2), isBold: true },
    { label: 'Ano', value: vehicle.ano.toString() },
    { label: 'Marca', value: vehicle.marca },
    { label: 'Modelo', value: vehicle.modelo },
    { label: 'Cor', value: vehicle.cor },
    { label: 'Tipo', value: vehicle.tipo },
    { label: 'Categoria', value: vehicle.categoria, isFullWidth: true },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {vehicle.marca} {vehicle.modelo}
          </Text>
          <Text style={styles.headerSubtitle}>
            {showSensitiveData ? vehicle.placa : maskData(vehicle.placa, 2)} • {vehicle.ano} • {vehicle.cor}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowSensitiveData(!showSensitiveData)}
        >
          {showSensitiveData ? <EyeOff size={20} color={Colors.text.secondary} /> : <Eye size={20} color={Colors.text.secondary} />}
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
        <VehicleInfoSection items={vehicleInfoItems} />

        {/* Documentação */}
        <CollapsibleSection
          icon={FileText}
          title="Documentação"
          isExpanded={isDocumentationExpanded}
          onToggle={() => setIsDocumentationExpanded(!isDocumentationExpanded)}
        >
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
                <Upload size={16} color={Colors.background.primary} />
                <Text style={styles.uploadButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.documentsList}>
              {documents.map((doc) => (
                <DocumentItem key={doc.id} document={doc} />
              ))}
            </View>
          </View>
        </CollapsibleSection>

        {/* Outras Informações */}
        <CollapsibleSection
          icon={Car}
          title="Outras Informações"
          isExpanded={isOtherInfoExpanded}
          onToggle={() => setIsOtherInfoExpanded(!isOtherInfoExpanded)}
        >
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
        </CollapsibleSection>

        {/* Vínculos */}
        <View style={styles.linksHeader}>
          <View style={styles.linksHeaderLeft}>
            <Text style={styles.linksTitle}>Vínculos</Text>
            <Text style={styles.linksCount}>
              {owners.length + renters.length + authorizedDrivers.length}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newLinkButton}
            onPress={() => router.push({
              pathname: '/add-link/select-action',
              params: { vehicleId: id }
            })}
          >
            <UserPlus size={16} color={Colors.background.primary} />
            <Text style={styles.newLinkButtonText}>Novo vínculo</Text>
          </TouchableOpacity>
        </View>

        {/* Proprietários */}
        {(owners.length > 0 || formerOwners.length > 0) && (
          <LinkSection
            title="Proprietários"
            count={owners.length}
            people={owners}
            formerPeople={formerOwners}
            showHistory={showHistoryFor.owner || false}
            onToggleHistory={() => toggleHistory('owner')}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}

        {/* Locatários */}
        {(renters.length > 0 || formerRenters.length > 0) && (
          <LinkSection
            title="Locatários"
            count={renters.length}
            people={renters}
            formerPeople={formerRenters}
            showHistory={showHistoryFor.renter || false}
            onToggleHistory={() => toggleHistory('renter')}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}

        {/* Condutores */}
        {(authorizedDrivers.length > 0 || formerAuthorizedDrivers.length > 0) && (
          <LinkSection
            title="Condutores"
            count={authorizedDrivers.length}
            people={authorizedDrivers}
            formerPeople={formerAuthorizedDrivers}
            showHistory={showHistoryFor.authorized_driver || false}
            onToggleHistory={() => toggleHistory('authorized_driver')}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
          />
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.background.tertiary,
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
    color: Colors.primary.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text.tertiary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  infoValueMono: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    fontFamily: 'monospace',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  tireInfo: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 12,
  },
  tireInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.light,
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
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  tireValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.DEFAULT,
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
    color: Colors.primary.dark,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.info.dark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: Colors.background.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  documentsList: {
    gap: 8,
  },
  linksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
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
    color: Colors.primary.dark,
  },
  linksCount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.tertiary,
  },
  newLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary.DEFAULT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  newLinkButtonText: {
    color: Colors.background.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
