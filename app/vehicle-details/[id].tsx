import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Car,
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
  Document,
} from '../../components/vehicle-details';
import { VehicleHeader } from '@/components/ui';
import { useSelectedVehicle } from '@/contexts';
import { useVehicle } from '@/hooks/vehicle';

interface Vehicle {
  marca: string;
  modelo: string;
  versao: string;
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

  // Get selected vehicle from context or params
  const { selectedVehicleId: contextVehicleId } = useSelectedVehicle();
  const paramsId = Array.isArray(id) ? id[0] : id;
  const vehicleId = paramsId || contextVehicleId;

  // Fetch vehicle data
  const { vehicle: vehicleData } = useVehicle(vehicleId || undefined);

  // Transform vehicle data for display
  const vehicle = useMemo<Vehicle>(() => {
    if (!vehicleData || !vehicleData.models || !vehicleData.brands) {
      return {
        marca: '',
        modelo: '',
        versao: '',
        tipo: '',
        categoria: '',
        ano: 0,
        placa: '',
        cor: '',
        quilometragem: '0 km',
        combustivel: '',
        seguro: '',
        localizacao: '',
        renavam: '',
        chassi: '',
        motor: '',
        paisOrigem: '',
        paisLicenciamento: '',
        anoModelo: 0,
        anoFabricacao: 0,
      };
    }

    const activePlate = vehicleData.plates?.find(p => p.active) || vehicleData.plates?.[0];
    const activeColor = vehicleData.colors?.find(c => c.active) || vehicleData.colors?.[0];
    const activeFuel = vehicleData.vehicle_fuels?.find(f => f.active) || vehicleData.vehicle_fuels?.[0];

    return {
      marca: vehicleData.brands?.brand || '',
      modelo: vehicleData.models?.model || '',
      versao: vehicleData.model_versions?.version || '',
      tipo: 'Carro', // TODO: Get from vehicle type
      categoria: vehicleData.vehicle_categories?.category || '',
      ano: vehicleData.model_year || 0,
      placa: activePlate?.plate || '',
      cor: activeColor?.color || '',
      quilometragem: '0 km', // TODO: Get from vehicle_odometer_readings
      combustivel: activeFuel?.fuels?.name || '',
      seguro: '', // TODO: Get from insurance table
      localizacao: '', // TODO: Get from location
      renavam: vehicleData.renavam || '',
      chassi: vehicleData.chassis || '',
      motor: '', // TODO: Get from engine specs
      paisOrigem: '', // TODO: Get from vehicle data
      paisLicenciamento: '', // TODO: Get from vehicle data
      anoModelo: vehicleData.model_year || 0,
      anoFabricacao: vehicleData.manufacture_year || 0,
    };
  }, [vehicleData]);

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

  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [isDocumentationExpanded, setIsDocumentationExpanded] = useState(false);
  const [isOtherInfoExpanded, setIsOtherInfoExpanded] = useState(false);

  const maskData = (data: string, visibleChars = 4) => {
    if (!data) return '';
    return '•'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
  };

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
      <VehicleHeader
        vehicleName={`${vehicle.marca} ${vehicle.modelo} ${vehicle.versao}`}
        vehicleDetails={`${showSensitiveData ? vehicle.placa : maskData(vehicle.placa, 2)} • ${vehicle.ano} • ${vehicle.cor}`}
        showChevron={false}
        showVehicleIcon={false}
        leftButton={
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        }
        rightButton={
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSensitiveData(!showSensitiveData)}
          >
            {showSensitiveData ? <EyeOff size={24} color={Colors.text.secondary} /> : <Eye size={24} color={Colors.text.secondary} />}
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  headerButton: {
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
});
