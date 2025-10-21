/**
 * ============================================================================
 * COMPONENT: VehicleProfilePhotoUpload
 * ============================================================================
 * Componente para upload de foto de perfil do veículo
 * Permite escolher da galeria ou tirar foto
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image as RNImage,
} from 'react-native';
import { Image } from 'lucide-react-native';
import { Camera, ImageIcon } from 'lucide-react-native';
import { Colors } from '@/constants';
import { useVehicleProfileUpload } from '@/hooks/useVehicleProfileUpload';

export interface VehicleProfilePhotoUploadProps {
  vehicleId: string;
  currentPhotoUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
  size?: number;
}

export function VehicleProfilePhotoUpload({
  vehicleId,
  currentPhotoUrl,
  onUploadSuccess,
  size = 120,
}: VehicleProfilePhotoUploadProps) {
  const {
    uploadState,
    pickAndUploadProfilePhoto,
    takeAndUploadProfilePhoto,
  } = useVehicleProfileUpload();

  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(currentPhotoUrl || null);

  const handleChoosePhoto = () => {
    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        {
          text: 'Tirar Foto',
          onPress: async () => {
            const url = await takeAndUploadProfilePhoto(vehicleId);
            if (url) {
              setLocalPhotoUrl(url);
              onUploadSuccess?.(url);
            }
          },
        },
        {
          text: 'Escolher da Galeria',
          onPress: async () => {
            const url = await pickAndUploadProfilePhoto(vehicleId);
            if (url) {
              setLocalPhotoUrl(url);
              onUploadSuccess?.(url);
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.photoContainer, { width: size, height: size }]}
        onPress={handleChoosePhoto}
        disabled={uploadState.isUploading}
        activeOpacity={0.7}
      >
        {localPhotoUrl ? (
          <RNImage
            source={{ uri: localPhotoUrl }}
            style={[styles.photo, { width: size, height: size }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size }]}>
            <ImageIcon size={size * 0.4} color={Colors.text.tertiary} />
          </View>
        )}

        {uploadState.isUploading && (
          <View style={[styles.loadingOverlay, { width: size, height: size }]}>
            <ActivityIndicator size="large" color={Colors.text.primary} />
          </View>
        )}

        {!uploadState.isUploading && (
          <View style={styles.editBadge}>
            <Camera size={16} color="#ffffff" />
          </View>
        )}
      </TouchableOpacity>

      {uploadState.error && (
        <Text style={styles.errorText}>{uploadState.error}</Text>
      )}

      <TouchableOpacity
        style={styles.changeButton}
        onPress={handleChoosePhoto}
        disabled={uploadState.isUploading}
      >
        <Text style={styles.changeButtonText}>
          {localPhotoUrl ? 'Alterar Foto' : 'Adicionar Foto'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  photoContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: Colors.background.secondary,
    borderWidth: 3,
    borderColor: Colors.background.primary,
  },
  photo: {
    borderRadius: 999,
  },
  placeholder: {
    borderRadius: 999,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background.primary,
  },
  changeButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.link,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.text.error,
    textAlign: 'center',
  },
});
