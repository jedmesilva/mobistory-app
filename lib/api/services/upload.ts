import { api } from '../config';
import type { UploadResponse } from '../types';

export const uploadService = {
  /**
   * Upload de arquivo único
   */
  async uploadFile(file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<UploadResponse> {
    const formData = new FormData();

    // @ts-ignore - FormData aceita Blob/File
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Upload de múltiplos arquivos
   */
  async uploadMultiple(files: Array<{
    uri: string;
    name: string;
    type: string;
  }>): Promise<{ files: UploadResponse[] }> {
    const formData = new FormData();

    files.forEach((file) => {
      // @ts-ignore - FormData aceita Blob/File
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    const response = await api.post<{ files: UploadResponse[] }>(
      '/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Obter URL completa do arquivo
   */
  getFileUrl(storedFilename: string): string {
    return `${api.defaults.baseURL}/upload/${storedFilename}`;
  },

  /**
   * Deletar arquivo
   */
  async deleteFile(storedFilename: string): Promise<void> {
    await api.delete(`/upload/${storedFilename}`);
  },
};
