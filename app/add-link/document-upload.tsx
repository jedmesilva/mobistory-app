import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Upload,
  Camera,
  Image as ImageIcon,
  FileText,
  X,
  AlertCircle,
  Edit2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uri: string;
  type: string;
}

export default function DocumentUploadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const action = params.action as string;
  const relationshipType = params.relationshipType as string;

  const vehicleData = {
    brand: 'Honda',
    model: 'Civic',
    plate: 'ABC-1234',
  };

  const relationshipLabels: { [key: string]: string } = {
    owner: 'Proprietário',
    renter: 'Locatário',
    authorized_driver: 'Condutor',
    technical: 'Responsável Técnico',
    other: 'Outro',
  };

  const getDocumentHint = () => {
    if (action === 'request') {
      return 'Documentos opcionais que apoiem sua solicitação';
    }

    const hints: { [key: string]: string } = {
      owner: 'Documento do veículo em seu nome (CRLV, nota fiscal)',
      renter: 'Contrato de locação, financiamento ou arrendamento',
      authorized_driver: 'Autorização do proprietário ou documento de vínculo',
      technical: 'Contrato de serviço ou responsabilidade técnica',
      other: 'Documentos que comprovem o vínculo especificado',
    };

    return hints[relationshipType] || 'Documentos comprobatórios';
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
        id: Date.now().toString() + index,
        name: asset.fileName || `Imagem_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        uri: asset.uri,
        type: 'image',
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: asset.fileName || `Foto_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        uri: asset.uri,
        type: 'image',
      };

      setUploadedFiles((prev) => [...prev, newFile]);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSubmit = () => {
    const data = {
      action,
      relationshipType,
      files: uploadedFiles,
      message: message.trim(),
      vehicle: vehicleData,
    };

    console.log('Enviando dados:', data);

    if (action === 'request') {
      Alert.alert(
        'Solicitação enviada!',
        'O proprietário receberá uma notificação e avaliará sua solicitação.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } else {
      Alert.alert(
        'Documentos enviados!',
        'Seus documentos foram enviados para validação. Aguarde a análise.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    }
  };

  const canSubmit = () => {
    if (action === 'request') {
      return message.trim() || uploadedFiles.length > 0;
    }
    return uploadedFiles.length > 0;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Comprovação de vínculo</Text>
          <Text style={styles.subtitle}>
            Envie um documento que comprove o vínculo com{' '}
            <Text style={styles.vehicleName}>
              {vehicleData.brand} {vehicleData.model}
            </Text>
          </Text>

          {/* Relationship Type Card */}
          <View style={styles.typeCard}>
            <View style={styles.typeCardContent}>
              <View>
                <Text style={styles.typeCardLabel}>Comprovando vínculo como</Text>
                <Text style={styles.typeCardValue}>
                  {relationshipLabels[relationshipType]}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.changeButton}
              >
                <Edit2 size={16} color={Colors.text.secondary} />
                <Text style={styles.changeButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Documentos</Text>
              {action === 'claim' && (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredBadgeText}>Obrigatório</Text>
                </View>
              )}
            </View>

            <Text style={styles.sectionHint}>{getDocumentHint()}</Text>

            <TouchableOpacity
              style={styles.uploadArea}
              onPress={pickImageFromGallery}
            >
              <View style={styles.uploadIcon}>
                <Upload size={28} color={Colors.text.placeholder} />
              </View>
              <Text style={styles.uploadTitle}>
                {isUploading ? 'Enviando...' : 'Enviar arquivos'}
              </Text>
              <Text style={styles.uploadSubtitle}>JPG, PNG até 10MB</Text>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={pickImageFromGallery}
              >
                <ImageIcon size={16} color={Colors.text.secondary} />
                <Text style={styles.quickActionText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={pickImageFromCamera}
              >
                <Camera size={16} color={Colors.text.secondary} />
                <Text style={styles.quickActionText}>Câmera</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.filesTitle}>
                Arquivos ({uploadedFiles.length})
              </Text>
              <View style={styles.filesList}>
                {uploadedFiles.map((file) => (
                  <View key={file.id} style={styles.fileItem}>
                    <View style={styles.fileIcon}>
                      {file.type === 'image' ? (
                        <ImageIcon size={16} color={Colors.text.secondary} />
                      ) : (
                        <FileText size={16} color={Colors.text.secondary} />
                      )}
                    </View>

                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemoveFile(file.id)}
                      style={styles.removeButton}
                    >
                      <X size={16} color={Colors.text.placeholder} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Message Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Mensagem{' '}
              {action === 'claim' && (
                <Text style={styles.optionalText}>(opcional)</Text>
              )}
            </Text>

            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder={
                action === 'request'
                  ? 'Explique por que precisa acessar este veículo...'
                  : 'Informações adicionais (opcional)...'
              }
              placeholderTextColor={Colors.text.placeholder}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />

            <Text style={styles.charCount}>{message.length}/500</Text>
          </View>

          {/* Warning Messages */}
          {action === 'claim' && uploadedFiles.length === 0 && (
            <View style={styles.warningBox}>
              <AlertCircle size={16} color="#d97706" />
              <Text style={styles.warningText}>
                Envie pelo menos um documento para validar seu vínculo.
              </Text>
            </View>
          )}

          {action === 'request' &&
            !message.trim() &&
            uploadedFiles.length === 0 && (
              <View style={styles.infoBox}>
                <AlertCircle size={16} color="#3b82f6" />
                <Text style={styles.infoText}>
                  Adicione uma mensagem ou documentos de apoio.
                </Text>
              </View>
            )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit()}
          style={[styles.submitButton, !canSubmit() && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitButtonText}>
            {action === 'request' ? 'Enviar Solicitação' : 'Enviar para Validação'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  vehicleName: {
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  typeCard: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  typeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeCardLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: 4,
  },
  typeCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 10,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 8,
  },
  requiredBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#dc2626',
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.text.placeholder,
  },
  sectionHint: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.border.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.dark,
    marginBottom: 12,
  },
  filesList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    gap: 12,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.dark,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  removeButton: {
    padding: 6,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.primary.dark,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: Colors.text.placeholder,
    marginTop: 6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.DEFAULT,
  },
  submitButton: {
    backgroundColor: Colors.primary.dark,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.background.tertiary,
  },
  submitButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
