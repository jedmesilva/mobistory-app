/**
 * ============================================================================
 * STORAGE UTILITIES
 * ============================================================================
 * Funções helper para upload e gerenciamento de arquivos nos buckets
 * ============================================================================
 */

import { supabase } from './supabase';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// ============================================================================
// TIPOS
// ============================================================================

export type StorageBucket =
  | 'vehicle-profiles'
  | 'vehicle-moments'
  | 'conversation-media'
  | 'vehicle-data';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface ImageSize {
  width: number;
  height: number;
  quality?: number;
}

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const IMAGE_SIZES = {
  avatar: { width: 200, height: 200, quality: 0.8 },
  medium: { width: 800, height: 800, quality: 0.9 },
  cover: { width: 1200, height: 400, quality: 0.9 },
  thumbnail: { width: 300, height: 300, quality: 0.7 },
  web: { width: 1024, height: 1024, quality: 0.85 },
};

// ============================================================================
// FUNÇÕES DE RESIZE
// ============================================================================

/**
 * Redimensiona uma imagem para um tamanho específico
 */
export async function resizeImage(
  uri: string,
  size: ImageSize
): Promise<string> {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: size.width, height: size.height } }],
      {
        compress: size.quality || 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
}

/**
 * Cria múltiplas versões de uma imagem
 */
export async function createImageVersions(
  uri: string,
  versions: Array<{ name: string; size: ImageSize }>
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const version of versions) {
    try {
      const resizedUri = await resizeImage(uri, version.size);
      results[version.name] = resizedUri;
    } catch (error) {
      console.error(`Error creating ${version.name} version:`, error);
    }
  }

  return results;
}

// ============================================================================
// FUNÇÕES DE UPLOAD
// ============================================================================

/**
 * Faz upload de um arquivo para o storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  uri: string,
  contentType?: string
): Promise<UploadResult> {
  try {
    // Lê o arquivo como base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Converte base64 para Blob
    const response = await fetch(`data:${contentType || 'application/octet-stream'};base64,${base64}`);
    const blob = await response.blob();

    // Upload para o Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Gera URL pública (se o bucket for público)
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      success: true,
      path: data.path,
      url: publicData.publicUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// VEHICLE PROFILES
// ============================================================================

/**
 * Faz upload da foto de perfil de um veículo
 * Cria automaticamente as versões: avatar, medium, original
 */
export async function uploadVehicleProfilePhoto(
  vehicleId: string,
  imageUri: string
): Promise<UploadResult> {
  try {
    // Cria versões da imagem
    const versions = await createImageVersions(imageUri, [
      { name: 'avatar', size: IMAGE_SIZES.avatar },
      { name: 'medium', size: IMAGE_SIZES.medium },
    ]);

    // Upload de cada versão
    const uploadPromises = [
      uploadFile('vehicle-profiles', `${vehicleId}/avatar.jpg`, versions.avatar, 'image/jpeg'),
      uploadFile('vehicle-profiles', `${vehicleId}/medium.jpg`, versions.medium, 'image/jpeg'),
      uploadFile('vehicle-profiles', `${vehicleId}/original.jpg`, imageUri, 'image/jpeg'),
    ];

    const results = await Promise.all(uploadPromises);

    // Verifica se todos os uploads foram bem-sucedidos
    const failed = results.find(r => !r.success);
    if (failed) {
      return { success: false, error: failed.error };
    }

    // Retorna a URL do avatar
    return results[0]; // avatar
  } catch (error) {
    console.error('Error uploading vehicle profile photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Faz upload da foto de capa de um veículo
 */
export async function uploadVehicleCoverPhoto(
  vehicleId: string,
  imageUri: string
): Promise<UploadResult> {
  try {
    const resizedUri = await resizeImage(imageUri, IMAGE_SIZES.cover);

    return await uploadFile(
      'vehicle-profiles',
      `${vehicleId}/cover.jpg`,
      resizedUri,
      'image/jpeg'
    );
  } catch (error) {
    console.error('Error uploading vehicle cover photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// VEHICLE MOMENTS
// ============================================================================

/**
 * Faz upload de mídia para um momento do veículo
 * Cria versões otimizadas automaticamente
 */
export async function uploadMomentMedia(
  vehicleId: string,
  momentId: string,
  mediaUri: string,
  mediaType: 'image' | 'video',
  index: number = 0
): Promise<UploadResult> {
  try {
    const filename = `${mediaType}-${index + 1}`;

    if (mediaType === 'image') {
      // Cria versões da imagem
      const versions = await createImageVersions(mediaUri, [
        { name: 'web', size: IMAGE_SIZES.web },
        { name: 'thumb', size: IMAGE_SIZES.thumbnail },
      ]);

      // Upload de todas as versões
      await Promise.all([
        uploadFile('vehicle-moments', `${vehicleId}/${momentId}/original/${filename}.jpg`, mediaUri, 'image/jpeg'),
        uploadFile('vehicle-moments', `${vehicleId}/${momentId}/web/${filename}.jpg`, versions.web, 'image/jpeg'),
        uploadFile('vehicle-moments', `${vehicleId}/${momentId}/thumb/${filename}.jpg`, versions.thumb, 'image/jpeg'),
      ]);

      // Retorna URL da versão web
      const { data } = supabase.storage
        .from('vehicle-moments')
        .getPublicUrl(`${vehicleId}/${momentId}/web/${filename}.jpg`);

      return {
        success: true,
        url: data.publicUrl,
        path: `${vehicleId}/${momentId}/web/${filename}.jpg`,
      };
    } else {
      // Para vídeos, upload apenas do original
      return await uploadFile(
        'vehicle-moments',
        `${vehicleId}/${momentId}/original/${filename}.mp4`,
        mediaUri,
        'video/mp4'
      );
    }
  } catch (error) {
    console.error('Error uploading moment media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// CONVERSATION MEDIA
// ============================================================================

/**
 * Faz upload de mídia para uma conversa
 */
export async function uploadConversationMedia(
  conversationId: string,
  mediaUri: string,
  mediaType: 'image' | 'video' | 'document' | 'audio',
  filename: string
): Promise<UploadResult> {
  try {
    const timestamp = Date.now();
    const extension = filename.split('.').pop() || 'jpg';
    const path = `${conversationId}/${timestamp}-${filename}`;

    // Determina o content type
    const contentTypeMap: Record<string, string> = {
      image: 'image/jpeg',
      video: 'video/mp4',
      audio: 'audio/mpeg',
      document: 'application/pdf',
    };

    const contentType = contentTypeMap[mediaType] || 'application/octet-stream';

    return await uploadFile('conversation-media', path, mediaUri, contentType);
  } catch (error) {
    console.error('Error uploading conversation media:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// VEHICLE DATA (Documents)
// ============================================================================

/**
 * Faz upload de documento do veículo
 */
export async function uploadVehicleDocument(
  vehicleId: string,
  documentType: 'documents' | 'ownership',
  filename: string,
  fileUri: string,
  entityId?: string
): Promise<UploadResult> {
  try {
    let path: string;

    if (documentType === 'ownership' && entityId) {
      path = `${vehicleId}/ownership/${entityId}/${filename}`;
    } else {
      path = `${vehicleId}/documents/${filename}`;
    }

    return await uploadFile('vehicle-data', path, fileUri, 'application/pdf');
  } catch (error) {
    console.error('Error uploading vehicle document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// FUNÇÕES DE LEITURA
// ============================================================================

/**
 * Lista arquivos em um bucket/caminho específico
 */
export async function listFiles(
  bucket: StorageBucket,
  path: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      console.error('Error listing files:', error);
      return [];
    }

    return data.map(file => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}

/**
 * Deleta um arquivo do storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Obtém URL pública de um arquivo
 */
export function getPublicUrl(
  bucket: StorageBucket,
  path: string
): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Obtém URL assinada (temporária) para um arquivo privado
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600 // 1 hora por padrão
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
}
