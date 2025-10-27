import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AuthEntityContextType {
  entityId: string | null;
  loading: boolean;
}

const AuthEntityContext = createContext<AuthEntityContextType | undefined>(undefined);

interface AuthEntityProviderProps {
  children: ReactNode;
}

export function AuthEntityProvider({ children }: AuthEntityProviderProps) {
  const { user, loading: authLoading } = useAuth();
  const [entityId, setEntityId] = useState<string | null>(null);

  useEffect(() => {
    // Por enquanto, usamos o user ID como entity ID
    // TODO: Implementar busca da entity real do usuário via API
    if (user) {
      setEntityId(user.id);
    } else {
      setEntityId(null);
    }
  }, [user]);

  return (
    <AuthEntityContext.Provider
      value={{
        entityId,
        loading: authLoading,
      }}
    >
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
