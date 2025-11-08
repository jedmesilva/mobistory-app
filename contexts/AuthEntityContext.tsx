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
import { entitiesService, Entity, AnonymousEntityCreate } from '../lib/api/entities';
import { collectDeviceFingerprint } from '../lib/utils/deviceFingerprint';

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
   * Load entity from AsyncStorage on app start
   */
  const loadEntity = useCallback(async () => {
    try {
      setLoading(true);

      // Check if entity ID exists in AsyncStorage
      const storedEntityId = await AsyncStorage.getItem(ENTITY_ID_KEY);

      if (storedEntityId) {
        // Fetch entity from backend
        const fetchedEntity = await entitiesService.getById(storedEntityId);
        setEntity(fetchedEntity);
        setEntityId(fetchedEntity.id);
      } else {
        // No entity found
        setEntity(null);
        setEntityId(null);
      }
    } catch (error) {
      console.error('Error loading entity:', error);
      // If entity not found or error, clear storage
      await AsyncStorage.removeItem(ENTITY_ID_KEY);
      setEntity(null);
      setEntityId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create anonymous entity with device fingerprint
   */
  const createAnonymousEntity = useCallback(async (): Promise<Entity> => {
    try {
      setLoading(true);

      // Collect device fingerprint
      const deviceFingerprint = await collectDeviceFingerprint();

      // Create anonymous entity
      const anonymousEntityData: AnonymousEntityCreate = {
        device_fingerprint: deviceFingerprint,
        name: 'Usuário Anônimo',
      };

      const newEntity = await entitiesService.createAnonymous(anonymousEntityData);

      // Store entity ID in AsyncStorage
      await AsyncStorage.setItem(ENTITY_ID_KEY, newEntity.id);

      // Update state
      setEntity(newEntity);
      setEntityId(newEntity.id);

      return newEntity;
    } catch (error) {
      console.error('Error creating anonymous entity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Load entity on mount
  useEffect(() => {
    loadEntity();
  }, [loadEntity]);

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
