import React, { createContext, useContext, ReactNode } from 'react';

// For now, we'll use a mock entity ID for João Silva
// Later this should come from authentication
const MOCK_ENTITY_ID = 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1';

interface AuthEntityContextType {
  entityId: string | null;
}

const AuthEntityContext = createContext<AuthEntityContextType | undefined>(undefined);

interface AuthEntityProviderProps {
  children: ReactNode;
}

export function AuthEntityProvider({ children }: AuthEntityProviderProps) {
  // TODO: Replace with real auth logic
  const entityId = MOCK_ENTITY_ID;

  return (
    <AuthEntityContext.Provider value={{ entityId }}>
      {children}
    </AuthEntityContext.Provider>
  );
}

export function useAuthEntity() {
  const context = useContext(AuthEntityContext);
  if (context === undefined) {
    throw new Error('useAuthEntity must be used within an AuthEntityProvider');
  }
  return context;
}
