/**
 * ============================================================================
 * HOOK: useVehicleProfileUpload
 * ============================================================================
 * Hook customizado para upload de fotos de perfil de veículos
 * ============================================================================
 */

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadVehicleProfilePhoto, uploadVehicleCoverPhoto } from '@/lib/storage';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
}

export function useVehicleProfileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null,
  });

  /**
   * Abre o seletor de imagem e faz upload da foto de perfil
   */
  const pickAndUploadProfilePhoto = async (vehicleId: string) => {
    try {
      // Solicita permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setUploadState(prev => ({
          ...prev,
          error: 'Permissão negada para acessar a galeria',
        }));
        return null;
      }

      // Abre seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Quadrado para avatar
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      // Atualiza estado: iniciando upload
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
      });

      // Faz upload
      const uploadResult = await uploadVehicleProfilePhoto(
        vehicleId,
        result.assets[0].uri
      );

      if (!uploadResult.success) {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: uploadResult.error || 'Erro ao fazer upload',
          url: null,
        });
        return null;
      }

      // Sucesso
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        url: uploadResult.url || null,
      });

      return uploadResult.url;
    } catch (error) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        url: null,
      });
      return null;
    }
  };

  /**
   * Abre a câmera e faz upload da foto de perfil
   */
  const takeAndUploadProfilePhoto = async (vehicleId: string) => {
    try {
      // Solicita permissão
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        setUploadState(prev => ({
          ...prev,
          error: 'Permissão negada para acessar a câmera',
        }));
        return null;
      }

      // Abre câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      // Atualiza estado: iniciando upload
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
      });

      // Faz upload
      const uploadResult = await uploadVehicleProfilePhoto(
        vehicleId,
        result.assets[0].uri
      );

      if (!uploadResult.success) {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: uploadResult.error || 'Erro ao fazer upload',
          url: null,
        });
        return null;
      }

      // Sucesso
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        url: uploadResult.url || null,
      });

      return uploadResult.url;
    } catch (error) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        url: null,
      });
      return null;
    }
  };

  /**
   * Upload direto de uma URI
   */
  const uploadProfilePhotoFromUri = async (vehicleId: string, uri: string) => {
    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
      });

      const uploadResult = await uploadVehicleProfilePhoto(vehicleId, uri);

      if (!uploadResult.success) {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: uploadResult.error || 'Erro ao fazer upload',
          url: null,
        });
        return null;
      }

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        url: uploadResult.url || null,
      });

      return uploadResult.url;
    } catch (error) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        url: null,
      });
      return null;
    }
  };

  /**
   * Upload de foto de capa
   */
  const pickAndUploadCoverPhoto = async (vehicleId: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setUploadState(prev => ({
          ...prev,
          error: 'Permissão negada para acessar a galeria',
        }));
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9], // Aspecto de capa
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
      });

      const uploadResult = await uploadVehicleCoverPhoto(
        vehicleId,
        result.assets[0].uri
      );

      if (!uploadResult.success) {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: uploadResult.error || 'Erro ao fazer upload',
          url: null,
        });
        return null;
      }

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        url: uploadResult.url || null,
      });

      return uploadResult.url;
    } catch (error) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        url: null,
      });
      return null;
    }
  };

  /**
   * Reset do estado
   */
  const reset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null,
    });
  };

  return {
    uploadState,
    pickAndUploadProfilePhoto,
    takeAndUploadProfilePhoto,
    uploadProfilePhotoFromUri,
    pickAndUploadCoverPhoto,
    reset,
  };
}
