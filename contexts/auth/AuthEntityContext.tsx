import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AuthEntityContextType {
  entityId: string | null;
  loading: boolean;
}

const AuthEntityContext = createContext<AuthEntityContextType | undefined>(undefined);

interface AuthEntityProviderProps {
  children: ReactNode;
}

export function AuthEntityProvider({ children }: AuthEntityProviderProps) {
  const [entityId, setEntityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch João Silva's entity ID from database
    // TODO: Replace with real auth logic
    async function fetchMockEntity() {
      try {
        const { data, error } = await supabase
          .from('entities')
          .select('id')
          .eq('name', 'João Silva')
          .eq('entity_type', 'person')
          .single();

        if (error) {
          console.error('Error fetching mock entity:', error);
        } else if (data) {
          setEntityId(data.id);
        }
      } catch (err) {
        console.error('Error fetching mock entity:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMockEntity();
  }, []);

  return (
    <AuthEntityContext.Provider value={{ entityId, loading }}>
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
