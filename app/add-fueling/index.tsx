import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import StationSelectionScreen from './station-selection';
import FuelInputScreen from './fuel-input';
import OdometerInputScreen from './odometer-input';
import SummaryScreen from './summary';
import type { Station } from '@/components/add-fueling';

type Step = 'station' | 'fuel' | 'odometer' | 'summary';

interface FuelingData {
  station: Station | null;
  fuelItems: any[];
  odometer: string;
  consumption: string;
}

export default function AddFuelingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('station');
  const [fuelingData, setFuelingData] = useState<FuelingData>({
    station: null,
    fuelItems: [],
    odometer: '',
    consumption: '',
  });

  const handleStationSelected = (station: Station) => {
    setFuelingData(prev => ({ ...prev, station }));
    setCurrentStep('fuel');
  };

  const handleFuelDataSubmitted = (fuelItems: any[]) => {
    setFuelingData(prev => ({ ...prev, fuelItems }));
    setCurrentStep('odometer');
  };

  const handleOdometerSubmitted = (odometer: string, consumption: string) => {
    setFuelingData(prev => ({ ...prev, odometer, consumption }));
    setCurrentStep('summary');
  };

  const handleBackFromFuel = () => {
    setCurrentStep('station');
  };

  const handleBackFromOdometer = () => {
    setCurrentStep('fuel');
  };

  const handleBackFromSummary = () => {
    setCurrentStep('odometer');
  };

  const handleComplete = () => {
    // TODO: Save fueling data
    router.back();
  };

  // Render current step
  switch (currentStep) {
    case 'station':
      return <StationSelectionScreen onStationSelected={handleStationSelected} />;
    case 'fuel':
      return (
        <FuelInputScreen
          selectedStation={fuelingData.station}
          onSubmit={handleFuelDataSubmitted}
          onBack={handleBackFromFuel}
        />
      );
    case 'odometer':
      return (
        <OdometerInputScreen
          onSubmit={handleOdometerSubmitted}
          onBack={handleBackFromOdometer}
        />
      );
    case 'summary':
      return (
        <SummaryScreen
          fuelingData={fuelingData}
          onComplete={handleComplete}
          onBack={handleBackFromSummary}
        />
      );
    default:
      return null;
  }
}
