/**
 * AuthEntityContext
 *
 * Manages entity authentication state, including:
 * - Loading entity from AsyncStorage on app start
 * - Creating anonymous entities
 * - Converting anonymous entities to verified
 * - Persisting entity ID in AsyncStorage
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { entitiesService, Entity, AnonymousEntityCreate } from '../../lib/api/entities';
import { collectDeviceFingerprint } from '../../lib/utils/deviceFingerprint';

const ENTITY_ID_KEY = '@mobistory:entity_id';

interface AuthEntityContextData {
  entity: Entity | null;
  entityId: string | null;
  loading: boolean;
  isAnonymous: boolean;

  // Actions
  createAnonymousEntity: () => Promise<Entity>;
  convertToVerified: (data: {
    email?: string;
    phone?: string;
    document_number?: string;
    display_name?: string;
  }) => Promise<Entity>;
  loadEntity: () => Promise<void>;
  clearEntity: () => Promise<void>;
}

const AuthEntityContext = createContext<AuthEntityContextData>({} as AuthEntityContextData);

export function AuthEntityProvider({ children }: { children: React.ReactNode }) {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [entityId, setEntityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Create anonymous entity with device fingerprint
   */
  const createAnonymousEntity = useCallback(async (): Promise<Entity> => {
    try {
      setLoading(true);

      console.log('[FRONTEND] Iniciando criação de entidade anônima...');

      // Collect device fingerprint
      console.log('[FRONTEND] Coletando device fingerprint...');
      const deviceFingerprint = await collectDeviceFingerprint();
      console.log('[FRONTEND] Device fingerprint coletado:', deviceFingerprint.deviceId);

      // Create anonymous entity
      const anonymousEntityData: AnonymousEntityCreate = {
        device_fingerprint: deviceFingerprint,
        name: 'Usuário Anônimo',
      };

      console.log('[FRONTEND] Enviando requisição para criar entidade anônima...');
      const newEntity = await entitiesService.createAnonymous(anonymousEntityData);
      console.log('[FRONTEND] Entidade anônima criada!', {
        id: newEntity.id,
        name: newEntity.name,
        is_anonymous: newEntity.is_anonymous,
      });

      // Store entity ID in AsyncStorage
      console.log('[FRONTEND] Salvando ID da entidade no AsyncStorage...');
      await AsyncStorage.setItem(ENTITY_ID_KEY, newEntity.id);
      console.log('[FRONTEND] ID salvo no AsyncStorage:', newEntity.id);

      // Update state
      setEntity(newEntity);
      setEntityId(newEntity.id);

      console.log('[FRONTEND] Processo de criação de entidade anônima concluído!');
      return newEntity;
    } catch (error) {
      console.error('[FRONTEND] Erro ao criar entidade anônima:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load entity from AsyncStorage on app start
   */
  const loadEntity = useCallback(async () => {
    try {
      console.log('[FRONTEND] Iniciando carregamento de entidade do AsyncStorage...');
      setLoading(true);

      // Check if entity ID exists in AsyncStorage
      const storedEntityId = await AsyncStorage.getItem(ENTITY_ID_KEY);
      console.log('[FRONTEND] Entity ID no AsyncStorage:', storedEntityId || 'Nenhum');

      if (storedEntityId) {
        // Fetch entity from backend
        try {
          console.log('[FRONTEND] Buscando entidade no backend...');
          const fetchedEntity = await entitiesService.getById(storedEntityId);
          console.log('[FRONTEND] Entidade carregada:', fetchedEntity.name);
          setEntity(fetchedEntity);
          setEntityId(fetchedEntity.id);
        } catch (fetchError: any) {
          console.warn('[FRONTEND] Erro ao buscar entidade do backend:', fetchError?.message || fetchError);

          // Check if entity was deleted (404) or just network error
          if (fetchError?.response?.status === 404) {
            console.log('[FRONTEND] Entidade não existe mais no backend (404), limpando storage...');
            await AsyncStorage.removeItem(ENTITY_ID_KEY);
            setEntity(null);
            setEntityId(null);
          } else {
            // Network error or server error - keep the ID for retry later
            console.log('[FRONTEND] Erro de rede ou servidor, mantendo ID armazenado para retry');
            setEntityId(storedEntityId);
            setEntity(null); // Data not available, but ID is kept
          }
        }
      } else {
        // No entity found - create one automatically
        console.log('[FRONTEND] Nenhuma entidade salva, criando entidade anônima automaticamente...');
        try {
          await createAnonymousEntity();
          console.log('[FRONTEND] Entidade anônima criada automaticamente com sucesso!');
        } catch (createError) {
          console.error('[FRONTEND] Erro ao criar entidade anônima automaticamente:', createError);
          setEntity(null);
          setEntityId(null);
        }
      }
    } catch (error) {
      console.error('[FRONTEND] Erro inesperado ao carregar entidade:', error);
      // Don't clear storage on unexpected errors
      setEntity(null);
    } finally {
      setLoading(false);
      console.log('[FRONTEND] Carregamento de entidade concluído');
    }
  }, [createAnonymousEntity]);

  /**
   * Convert anonymous entity to verified entity
   */
  const convertToVerified = useCallback(
    async (data: {
      email?: string;
      phone?: string;
      document_number?: string;
      display_name?: string;
    }): Promise<Entity> => {
      if (!entityId) {
        throw new Error('No entity ID found');
      }

      if (!entity?.is_anonymous) {
        throw new Error('Entity is not anonymous');
      }

      try {
        setLoading(true);

        // Convert anonymous entity
        const updatedEntity = await entitiesService.convertAnonymous(entityId, data);

        // Update state
        setEntity(updatedEntity);

        return updatedEntity;
      } catch (error) {
        console.error('Error converting anonymous entity:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [entityId, entity]
  );

  /**
   * Clear entity from storage and state
   */
  const clearEntity = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ENTITY_ID_KEY);
      setEntity(null);
      setEntityId(null);
    } catch (error) {
      console.error('Error clearing entity:', error);
      throw error;
    }
  }, []);

  // Load entity on mount (only once)
  useEffect(() => {
    console.log('🔵 [FRONTEND] AuthEntityProvider montado, carregando entidade...');
    loadEntity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const contextValue: AuthEntityContextData = {
    entity,
    entityId,
    loading,
    isAnonymous: entity?.is_anonymous ?? false,
    createAnonymousEntity,
    convertToVerified,
    loadEntity,
    clearEntity,
  };

  return (
    <AuthEntityContext.Provider value={contextValue}>
      {children}
    </AuthEntityContext.Provider>
  );
}

export function useAuthEntity() {
  const context = useContext(AuthEntityContext);

  if (!context) {
    throw new Error('useAuthEntity must be used within an AuthEntityProvider');
  }

  return context;
}
