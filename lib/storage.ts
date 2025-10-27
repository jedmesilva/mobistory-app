// Stub temporário para funções de storage
// TODO: Implementar upload real quando necessário

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadVehicleProfilePhoto(
  vehicleId: string,
  uri: string
): Promise<UploadResult> {
  // Mock de upload - retorna sucesso temporariamente
  console.log('Upload profile photo stub called:', { vehicleId, uri });
  return {
    success: true,
    url: uri, // Retorna a URI local por enquanto
  };
}

export async function uploadVehicleCoverPhoto(
  vehicleId: string,
  uri: string
): Promise<UploadResult> {
  // Mock de upload - retorna sucesso temporariamente
  console.log('Upload cover photo stub called:', { vehicleId, uri });
  return {
    success: true,
    url: uri, // Retorna a URI local por enquanto
  };
}
