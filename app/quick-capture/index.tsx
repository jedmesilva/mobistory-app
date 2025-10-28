import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CaptureScreen from './capture';
import ChatScreen from './chat';

type Step = 'capture' | 'chat';

interface CaptureData {
  uri: string;
  type: 'photo' | 'video';
}

export default function QuickCaptureFlow() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { from, context, vehicleId } = params;

  const [currentStep, setCurrentStep] = useState<Step>('capture');
  const [captureData, setCaptureData] = useState<CaptureData | null>(null);

  // Determine if we need chat step based on context
  const needsChatStep = () => {
    // 'open' context always needs chat (from Nova Atualização)
    if (context === 'open') return true;

    // 'fueling' and 'odometer' can skip chat if data is clear
    // For now, we'll implement simple logic - can be enhanced with AI/OCR
    return false; // Skip chat for specific contexts for now
  };

  const handleCaptureComplete = (data: CaptureData) => {
    setCaptureData(data);

    if (needsChatStep()) {
      // Go to chat step
      setCurrentStep('chat');
    } else {
      // Skip chat and return to origin
      handleFlowComplete();
    }
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
