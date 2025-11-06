import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit3 } from 'lucide-react-native';
import { Colors } from '@/constants';
import { SearchableInput, StepHeader, VehicleHeader, QuickCaptureButton, type SuggestionItem } from '@/components/add-vehicle';
import type { VehicleData } from './index';

interface SelectVersionScreenProps {
  catalog: any;
  vehicleData: VehicleData;
  onVersionSelected: (data: Partial<VehicleData>) => void;
  onBack: () => void;
  onShowCaptureModal: () => void;
}

export default function SelectVersionScreen({ catalog, vehicleData, onVersionSelected, onBack, onShowCaptureModal }: SelectVersionScreenProps) {
  const [versionSearch, setVersionSearch] = useState('');
  const [showVersionSuggestions, setShowVersionSuggestions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('');

  useEffect(() => {
    if (vehicleData.brand_id && vehicleData.model_id && !vehicleData.isNewBrand && !vehicleData.isNewModel) {
      catalog.loadVersions(vehicleData.brand_id, vehicleData.model_id);
    } else {
      catalog.resetVersion();
    }
  }, [vehicleData.brand_id, vehicleData.model_id]);

  const getFilteredVersions = (): SuggestionItem[] => {
    const filtered = versionSearch
      ? catalog.versions.filter((v: any) => v.name.toLowerCase().includes(versionSearch.toLowerCase()))
      : catalog.versions;
    return filtered.map((v: any) => ({ name: v.name, verified: v.verified }));
  };

  const handleVersionSelect = (versionName: string) => {
    setVersionSearch(versionName);
    setSelectedVersion(versionName);
    setShowVersionSuggestions(false);

    const existingVersion = catalog.versions.find((v: any) => v.name.toLowerCase() === versionName.toLowerCase());
    if (existingVersion) {
      onVersionSelected({ version_id: existingVersion.id, name: existingVersion.name, isNewVersion: false });
    } else {
      onVersionSelected({ version_id: '', name: versionName, isNewVersion: true });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="always">
        <VehicleHeader onBack={onBack} hasAutoData={false} vehicleData={{} as any} colors={[]} progress={(3 / 7) * 100} isFirstStep={false} />
        <View style={styles.stepContainer}>
          <StepHeader icon={<Edit3 size={32} color={Colors.background.primary} />} title="Versão ou especificação" subtitle="Digite para buscar ou criar nova" />
          <SearchableInput
            value={versionSearch}
            onChangeText={(text) => { setVersionSearch(text); setShowVersionSuggestions(true); }}
            onFocus={() => setShowVersionSuggestions(true)}
            placeholder="Ex: EXL, GLi, Comfort..."
            showSuggestions={showVersionSuggestions}
            suggestions={getFilteredVersions()}
            selectedValue={selectedVersion}
            onSelectSuggestion={handleVersionSelect}
            onCreateNew={() => versionSearch.trim() && handleVersionSelect(versionSearch)}
            createNewLabel={versionSearch && getFilteredVersions().length === 0 ? `Nova versão: "${versionSearch}"` : 'Nova versão'}
            successMessage={selectedVersion ? `${vehicleData.brand} ${vehicleData.model} ${selectedVersion}` : undefined}
            onClear={() => { setVersionSearch(''); setSelectedVersion(''); setShowVersionSuggestions(true); }}
            autoFocus
          />
        </View>
      </ScrollView>

      {/* Botão de Captura Rápida */}
      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Capturar Versão"
        description="Identificar versão/especificação"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 200 },
  stepContainer: { gap: 24, padding: 24 },
});
