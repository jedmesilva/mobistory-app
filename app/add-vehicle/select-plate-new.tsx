import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Check, AlertTriangle, Info, ChevronDown, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants';
import {
  StepHeader,
  VehicleHeader,
  QuickCaptureButton,
} from '@/components/add-vehicle';
import { usePlateModels } from '@/lib/api/hooks';
import type { PlateType } from '@/lib/api/types';
import type { VehicleData } from './index';

interface SelectPlateScreenProps {
  vehicleData?: VehicleData;
  onPlateSelected: (plateTypeId: string, plateNumber: string, plateModelId: string) => void;
  onBack: () => void;
  onShowCaptureModal: () => void;
}

export default function SelectPlateScreen({
  vehicleData,
  onPlateSelected,
  onBack,
  onShowCaptureModal,
}: SelectPlateScreenProps) {
  // Estados principais
  const [plateNumber, setPlateNumber] = useState(vehicleData?.plate || '');
  const [selectedType, setSelectedType] = useState<string | null>(vehicleData?.plate_type_id || null);
  const [detectedModel, setDetectedModel] = useState<any | null>(null);
  const [availableTypes, setAvailableTypes] = useState<PlateType[]>([]);
  const [manualModelId, setManualModelId] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [showManualSelection, setShowManualSelection] = useState(false);

  // Estados para backup (quando usuário clica em "alterar")
  const [previousDetectedModel, setPreviousDetectedModel] = useState<any | null>(null);
  const [previousAvailableTypes, setPreviousAvailableTypes] = useState<PlateType[]>([]);

  // Hook para buscar modelos (usado quando detecção falha)
  const { plateModels, detectPlateModel } = usePlateModels({ country: 'BR' });

  // Debounce ref
  const detectionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Carregar tipos de placa se já existir dados salvos
  useEffect(() => {
    const loadSavedPlateTypes = async () => {
      if (vehicleData?.plate_model_id && vehicleData?.plate) {
        try {
          const { plateTypesService } = await import('@/lib/api/services');
          const types = await plateTypesService.list({ plate_model_id: vehicleData.plate_model_id });
          setAvailableTypes(types);
          setManualModelId(vehicleData.plate_model_id);
        } catch (error) {
          console.error('Error loading saved plate types:', error);
        }
      }
    };

    loadSavedPlateTypes();
  }, []); // Executar apenas uma vez na montagem

  // Limpar placa: remover caracteres não alfanuméricos e converter para maiúsculas
  const cleanPlateNumber = (plate: string) => {
    return plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  };

  // Handler de mudança de texto da placa
  const handlePlateChange = (text: string) => {
    // Converter para maiúsculas e limitar a 12 caracteres
    const cleaned = text.toUpperCase().substring(0, 12);
    setPlateNumber(cleaned);

    // Resetar estados
    setDetectedModel(null);
    setAvailableTypes([]);
    setSelectedType(null);
    setDetectionError(null);
    setShowManualSelection(false);
    setManualModelId(null);

    // Limpar backups (nova digitação = nova detecção)
    setPreviousDetectedModel(null);
    setPreviousAvailableTypes([]);

    // Se menos de 4 caracteres, não tenta detectar
    const cleanedPlate = cleanPlateNumber(cleaned);
    if (cleanedPlate.length < 4) {
      return;
    }

    // Cancelar detecção anterior se existir
    if (detectionTimeout.current) {
      clearTimeout(detectionTimeout.current);
    }

    // Agendar nova detecção (debounce de 500ms)
    detectionTimeout.current = setTimeout(() => {
      handleDetectPlateModel(cleanedPlate);
    }, 500);
  };

  // Detectar modelo de placa
  const handleDetectPlateModel = async (cleanedPlate: string) => {
    setIsDetecting(true);
    setDetectionError(null);

    try {
      const result = await detectPlateModel(cleanedPlate);

      if (result.detected && result.model && result.available_types) {
        // Modelo detectado com sucesso
        setDetectedModel(result.model);
        setAvailableTypes(result.available_types);
        setShowManualSelection(false);
        setDetectionError(null);
      } else {
        // Não detectado - mostrar seleção manual
        setDetectedModel(null);
        setAvailableTypes([]);
        setDetectionError('Não foi possível reconhecer automaticamente o modelo da placa. Por favor, selecione o modelo manualmente abaixo.');
        setShowManualSelection(true);
      }
    } catch (error: any) {
      setDetectionError('Não foi possível verificar o formato da placa. Por favor, selecione o modelo manualmente abaixo.');
      setShowManualSelection(true);
    } finally {
      setIsDetecting(false);
    }
  };

  // Alterar modelo (quando usuário clica em "alterar")
  const handleChangeModel = () => {
    // Salvar estado atual para poder cancelar depois
    setPreviousDetectedModel(detectedModel);
    setPreviousAvailableTypes(availableTypes);

    // Limpar seleções e mostrar seleção manual
    setDetectedModel(null);
    setAvailableTypes([]);
    setSelectedType(null);
    setManualModelId(null);
    setShowManualSelection(true);
  };

  // Cancelar alteração de modelo (volta ao modelo detectado)
  const handleCancelChange = () => {
    // Restaurar modelo e tipos detectados anteriormente
    setDetectedModel(previousDetectedModel);
    setAvailableTypes(previousAvailableTypes);
    setShowManualSelection(false);
    setManualModelId(null);
    setDetectionError(null);

    // Limpar backup
    setPreviousDetectedModel(null);
    setPreviousAvailableTypes([]);
  };

  // Selecionar modelo manualmente
  const handleSelectManualModel = async (modelId: string) => {
    setManualModelId(modelId);
    setIsDetecting(true);

    try {
      // Buscar tipos de placa para este modelo
      const { plateTypesService } = await import('@/lib/api/services');
      const types = await plateTypesService.list({ plate_model_id: modelId });
      setAvailableTypes(types);
      setShowManualSelection(false);
      setDetectionError(null);

      // Limpar backups (modelo selecionado passa a ser o atual)
      setPreviousDetectedModel(null);
      setPreviousAvailableTypes([]);
    } catch (error: any) {
      setDetectionError('Não foi possível carregar os tipos de placa para este modelo. Tente novamente.');
    } finally {
      setIsDetecting(false);
    }
  };

  // Selecionar tipo de placa
  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  // Submeter
  const handleSubmit = () => {
    if (plateNumber.trim().length >= 7 && selectedType) {
      const modelId = detectedModel?.id || manualModelId;
      if (modelId) {
        onPlateSelected(selectedType, cleanPlateNumber(plateNumber), modelId);
      }
    }
  };

  // Validar se pode prosseguir
  const canProceed =
    plateNumber.trim().length >= 7 &&
    selectedType !== null &&
    (detectedModel !== null || manualModelId !== null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (detectionTimeout.current) {
        clearTimeout(detectionTimeout.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <VehicleHeader
          onBack={onBack}
          hasAutoData={false}
          vehicleData={{} as any}
          colors={[]}
          progress={(5 / 8) * 100}
          isFirstStep={false}
        />

        <View style={styles.stepContainer}>
          <StepHeader
            icon={<CreditCard size={32} color={Colors.background.primary} />}
            title="Placa do Veículo"
            subtitle="Informe o número da placa"
          />

          {/* Campo de entrada da placa */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Número da Placa</Text>
            <TextInput
              style={styles.plateInput}
              value={plateNumber}
              onChangeText={handlePlateChange}
              placeholder="Ex: ABC1D23"
              placeholderTextColor={Colors.text.tertiary}
              maxLength={12}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
            />
            <Text style={styles.inputHint}>
              Digite a placa sem espaços ou hífens
            </Text>
          </View>

          {/* Indicador de detecção */}
          {isDetecting && (
            <View style={styles.detectingContainer}>
              <ActivityIndicator size="small" color={Colors.primary.DEFAULT} />
              <Text style={styles.detectingText}>Detectando formato...</Text>
            </View>
          )}

          {/* Modelo selecionado (detectado ou manual) */}
          {!showManualSelection && (detectedModel || (manualModelId && availableTypes.length > 0)) && (() => {
            const selectedModel = detectedModel || plateModels.find(m => m.id === manualModelId);
            const isAutoDetected = !!detectedModel;

            return selectedModel ? (
              <View style={styles.detectedCard}>
                <View style={styles.detectedContent}>
                  <View style={styles.detectedIconContainer}>
                    <Check size={20} color={Colors.success.DEFAULT} strokeWidth={3} />
                  </View>
                  <View style={styles.detectedInfo}>
                    <Text style={styles.detectedLabel}>
                      {isAutoDetected ? 'Modelo de placa detectado' : 'Modelo de placa selecionado'}
                    </Text>
                    <Text style={styles.detectedTitle}>{selectedModel.name}</Text>
                    <Text style={styles.detectedExample}>
                      Exemplo: {selectedModel.format_example}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handleChangeModel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changeButtonText}>Alterar modelo</Text>
                </TouchableOpacity>
              </View>
            ) : null;
          })()}

          {/* Mensagem informativa quando não detecta automaticamente */}
          {detectionError && showManualSelection && (
            <View style={styles.infoCard}>
              <View style={styles.infoContent}>
                <View style={styles.infoIconContainer}>
                  <AlertCircle size={22} color={Colors.warning.DEFAULT} strokeWidth={2.5} />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Seleção Manual Necessária</Text>
                  <Text style={styles.infoDescription}>
                    Não conseguimos identificar o modelo automaticamente. Selecione manualmente abaixo.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Botão cancelar (quando usuário clicou em "alterar") */}
          {showManualSelection && previousDetectedModel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelChange}
            >
              <Text style={styles.cancelButtonText}>Cancelar e voltar ao modelo detectado</Text>
            </TouchableOpacity>
          )}

          {/* Seleção manual de modelo */}
          {showManualSelection && plateModels.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Selecione o Modelo da Placa</Text>
              <View style={styles.modelsGrid}>
                {plateModels.map((model) => (
                  <TouchableOpacity
                    key={model.id}
                    style={[
                      styles.modelCard,
                      manualModelId === model.id && styles.modelCardSelected,
                    ]}
                    onPress={() => handleSelectManualModel(model.id)}
                  >
                    <View style={styles.modelHeader}>
                      <View style={styles.modelInfo}>
                        <Text style={[
                          styles.modelName,
                          manualModelId === model.id && styles.modelNameSelected,
                        ]}>
                          {model.name}
                        </Text>
                        <Text style={[
                          styles.modelExample,
                          manualModelId === model.id && styles.modelExampleSelected,
                        ]}>
                          Ex: {model.format_example}
                        </Text>
                      </View>
                      {manualModelId === model.id && (
                        <View style={styles.modelCheckContainer}>
                          <Check size={18} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Lista de tipos de placa */}
          {availableTypes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tipo de Placa</Text>
              <Text style={styles.sectionDescription}>
                Selecione o tipo de placa correspondente ao seu veículo
              </Text>
              <View style={styles.typesGrid}>
                {availableTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      selectedType === type.id && styles.typeCardSelected,
                    ]}
                    onPress={() => handleSelectType(type.id)}
                  >
                    {/* Header com nome e checkbox */}
                    <View style={styles.typeHeader}>
                      <View style={[
                        styles.typeColorIndicator,
                        {
                          backgroundColor: type.border_color || type.background_color || Colors.border.DEFAULT,
                        }
                      ]} />
                      <Text style={[
                        styles.typeName,
                        selectedType === type.id && styles.typeNameSelected,
                      ]}>
                        {type.name}
                      </Text>
                      {selectedType === type.id && (
                        <View style={styles.checkContainer}>
                          <Check size={18} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </View>

                    {/* Preview compacto da placa */}
                    <View style={[
                      styles.colorPreview,
                      {
                        backgroundColor: type.background_color || '#CCCCCC',
                        borderColor: type.border_color || '#999999',
                        borderWidth: selectedType === type.id ? 3 : 2,
                      }
                    ]}>
                      <Text style={[
                        styles.colorPreviewText,
                        { color: type.text_color || '#000000' }
                      ]}>
                        {plateNumber || 'ABC1D23'}
                      </Text>
                    </View>

                    {/* Aviso de licença especial */}
                    {type.requires_special_license && (
                      <Text style={styles.licenseWarning}>
                        ⚠️ Requer licença especial
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Botão Continuar */}
          {canProceed && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleSubmit}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <QuickCaptureButton
        onPress={onShowCaptureModal}
        label="Capturar Placa"
        description="Identificar placa com câmera"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  stepContainer: {
    gap: 20,
    padding: 20,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginTop: -4,
  },
  plateInput: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    padding: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  inputHint: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  detectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
  },
  detectingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detectedCard: {
    padding: 16,
    backgroundColor: Colors.success.light,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.success.DEFAULT,
    gap: 12,
    shadowColor: Colors.success.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detectedContent: {
    flexDirection: 'row',
    gap: 12,
  },
  detectedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.success.DEFAULT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  detectedInfo: {
    flex: 1,
    gap: 2,
  },
  detectedLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success.dark,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detectedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success.dark,
  },
  detectedExample: {
    fontSize: 13,
    color: Colors.success.dark,
    opacity: 0.8,
  },
  changeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.success.DEFAULT,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success.dark,
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD666',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CC8800',
    lineHeight: 22,
  },
  infoDescription: {
    fontSize: 14,
    color: '#996600',
    lineHeight: 20,
  },
  modelsGrid: {
    gap: 12,
  },
  modelCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modelCardSelected: {
    borderColor: Colors.primary.DEFAULT,
    borderWidth: 3,
    backgroundColor: Colors.background.primary,
    shadowColor: Colors.primary.DEFAULT,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modelInfo: {
    flex: 1,
    gap: 4,
  },
  modelCheckContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modelNameSelected: {
    color: Colors.primary.DEFAULT,
    fontWeight: '700',
  },
  modelExample: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  modelExampleSelected: {
    color: Colors.primary.DEFAULT,
    fontWeight: '600',
  },
  typesGrid: {
    gap: 12,
  },
  typeCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    backgroundColor: Colors.background.secondary,
    gap: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeCardSelected: {
    borderColor: Colors.primary.DEFAULT,
    borderWidth: 3,
    backgroundColor: Colors.background.primary,
    shadowColor: Colors.primary.DEFAULT,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typeColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  typeNameSelected: {
    color: Colors.primary.DEFAULT,
    fontWeight: '700',
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  colorPreview: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    alignSelf: 'stretch',
  },
  colorPreviewText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  licenseWarning: {
    fontSize: 12,
    color: Colors.warning.DEFAULT,
    fontWeight: '500',
    paddingTop: 4,
  },
  continueButton: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
});
