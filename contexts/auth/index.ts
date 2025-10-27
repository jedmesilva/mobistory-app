// Hook temporário sem autenticação - retorna um entityId fixo
export function useAuthEntity() {
  // TODO: Implementar autenticação real quando necessário
  // Por enquanto, retorna um entityId fixo de teste
  return {
    entityId: '1aaafbdc-59f6-4ac7-8757-47d5648c09b5', // ID de teste fixo
    loading: false,
  };
}
