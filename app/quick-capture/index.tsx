import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CaptureScreen from './capture';
import ChatScreen from './chat';

type Step = 'capture' | 'chat';

interface CapturedMedia {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  timestamp: number;
}

export default function QuickCaptureFlow() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { from, context, vehicleId } = params;

  const [currentStep, setCurrentStep] = useState<Step>('capture');
  const [captureData, setCaptureData] = useState<CapturedMedia[]>([]);

  // SEMPRE vai para o chat após captura para a AI processar os dados
  const handleCaptureComplete = (data: CapturedMedia[]) => {
    setCaptureData(data);

    // Sempre vai para o chat step para a AI processar
    setCurrentStep('chat');
  };

  const handleChatComplete = () => {
    handleFlowComplete();
  };

  const handleFlowComplete = () => {
    // Emit event to notify that capture was completed successfully
    DeviceEventEmitter.emit('quickCaptureCompleted');

    // Navigate back to origin with data
    // TODO: Pass captured data back to origin screen
    router.back();
  };

  const handleBack = () => {
    if (currentStep === 'chat') {
      setCurrentStep('capture');
    } else {
      router.back();
    }
  };

  // Render current step
  switch (currentStep) {
    case 'capture':
      return (
        <CaptureScreen
          onCaptureComplete={handleCaptureComplete}
          onBack={handleBack}
          context={context as string}
        />
      );
    case 'chat':
      return (
        <ChatScreen
          captureData={captureData}
          vehicleId={vehicleId as string}
          context={context as string}
          onComplete={handleChatComplete}
          onBack={handleBack}
        />
      );
    default:
      return null;
  }
}
