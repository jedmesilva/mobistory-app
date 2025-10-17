import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_VEHICLE_KEY = '@mobistory:selected_vehicle';

interface SelectedVehicleContextData {
  selectedVehicleId: string | null;
  setSelectedVehicleId: (vehicleId: string | null) => Promise<void>;
  clearSelectedVehicle: () => Promise<void>;
  isLoading: boolean;
}

const SelectedVehicleContext = createContext<SelectedVehicleContextData>({
  selectedVehicleId: null,
  setSelectedVehicleId: async () => {},
  clearSelectedVehicle: async () => {},
  isLoading: true,
});

interface SelectedVehicleProviderProps {
  children: ReactNode;
}

export function SelectedVehicleProvider({ children }: SelectedVehicleProviderProps) {
  const [selectedVehicleId, setSelectedVehicleIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load selected vehicle from AsyncStorage on mount
  useEffect(() => {
    loadSelectedVehicle();
  }, []);

  const loadSelectedVehicle = async () => {
    try {
      const storedVehicleId = await AsyncStorage.getItem(SELECTED_VEHICLE_KEY);
      if (storedVehicleId) {
        setSelectedVehicleIdState(storedVehicleId);
        console.log('📌 Loaded selected vehicle from storage:', storedVehicleId);
      }
    } catch (error) {
      console.error('Error loading selected vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedVehicleId = async (vehicleId: string | null) => {
    try {
      if (vehicleId) {
        await AsyncStorage.setItem(SELECTED_VEHICLE_KEY, vehicleId);
        setSelectedVehicleIdState(vehicleId);
        console.log('✅ Selected vehicle saved:', vehicleId);
      } else {
        await AsyncStorage.removeItem(SELECTED_VEHICLE_KEY);
        setSelectedVehicleIdState(null);
        console.log('🗑️ Selected vehicle cleared');
      }
    } catch (error) {
      console.error('Error saving selected vehicle:', error);
    }
  };

  const clearSelectedVehicle = async () => {
    await setSelectedVehicleId(null);
  };

  return (
    <SelectedVehicleContext.Provider
      value={{
        selectedVehicleId,
        setSelectedVehicleId,
        clearSelectedVehicle,
        isLoading,
      }}
    >
      {children}
    </SelectedVehicleContext.Provider>
  );
}

export function useSelectedVehicle() {
  const context = useContext(SelectedVehicleContext);
  if (!context) {
    throw new Error('useSelectedVehicle must be used within a SelectedVehicleProvider');
  }
  return context;
}
