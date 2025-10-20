import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Image,
  RefreshCw,
  X,
  Zap,
  ZapOff,
} from 'lucide-react-native';
import { Colors } from '@/constants';

export default function QuickCaptureScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTime = useRef<number | null>(null);
  const recordingPromise = useRef<Promise<any> | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      // Cleanup timers on unmount
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  if (!cameraPermission || !microphonePermission) {
    // Permissions are still loading
    return <View style={styles.container} />;
  }

  const requestAllPermissions = async () => {
    await requestCameraPermission();
    await requestMicrophonePermission();
  };

  if (!cameraPermission.granted || !microphonePermission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Header */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Captura Rápida</Text>
            <View style={styles.headerButton} />
          </View>
        </SafeAreaView>

        {/* Permission Content */}
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <Camera size={80} color="#ffffff" strokeWidth={1.5} />
          </View>

          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>
              Acesso à Câmera Necessário
            </Text>
            <Text style={styles.permissionDescription}>
              Para capturar fotos e vídeos do seu veículo, precisamos de permissão para acessar a câmera do dispositivo.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestAllPermissions}
            activeOpacity={0.8}
          >
            <Camera size={20} color="#000000" />
            <Text style={styles.permissionButtonText}>Permitir Acesso à Câmera e Microfone</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.permissionSecondaryButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.permissionSecondaryButtonText}>Agora Não</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 8,
    }).start();

    pressTimer.current = setTimeout(() => {
      // Start recording after 500ms
      startRecording();
    }, 500);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    if (isRecording) {
      // Calculate actual recording time
      const actualRecordingTime = recordingStartTime.current
        ? (Date.now() - recordingStartTime.current) / 1000
        : 0;

      // Minimum 2 seconds for reliable video recording
      const MIN_RECORDING_TIME = 2;

      if (actualRecordingTime >= MIN_RECORDING_TIME) {
        stopRecording();
      } else {
        // Wait until at least 2 seconds has passed
        const waitTime = (MIN_RECORDING_TIME - actualRecordingTime) * 1000;
        console.log(`Waiting ${waitTime}ms before stopping recording...`);
        setTimeout(() => {
          stopRecording();
        }, waitTime);
      }
    } else {
      // Take photo (quick tap)
      takePhoto();
    }
  };

  const startRecording = async () => {
    try {
      if (!cameraRef.current) {
        console.error('❌ Camera ref not available');
        return;
      }

      setIsRecording(true);
      setRecordingTime(0);
      recordingStartTime.current = Date.now();
      console.log('🎥 Starting video recording...');

      // Start recording interval
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start recording - this promise will resolve when stopRecording() is called
      try {
        console.log('📹 Calling recordAsync with options...');
        const video = await cameraRef.current.recordAsync();

        // Recording completed successfully
        console.log('✅ Video gravado com sucesso!');
        console.log('📹 Duração:', video?.duration, 'ms');
        console.log('📁 URI:', video?.uri);
        console.log('📦 Objeto completo:', JSON.stringify(video, null, 2));

        // Clean up after successful recording
        recordingStartTime.current = null;
        recordingPromise.current = null;

        // TODO: Save or process the video

      } catch (recordError: any) {
        console.error('❌ Erro completo:', recordError);
        console.error('Message:', recordError.message);
        console.error('Code:', recordError.code);
        console.error('Stack:', recordError.stack);
      }

    } catch (error) {
      console.error('❌ Error starting video recording:', error);
    } finally {
      // Always clean up state
      setIsRecording(false);
      recordingStartTime.current = null;
      recordingPromise.current = null;
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
      setRecordingTime(0);
    }
  };

  const stopRecording = () => {
    try {
      const actualRecordingTime = recordingStartTime.current
        ? (Date.now() - recordingStartTime.current) / 1000
        : 0;
      console.log(`⏹️ Stopping recording: ${actualRecordingTime.toFixed(2)} seconds`);
      console.log('📹 isRecording:', isRecording);
      console.log('📹 cameraRef.current:', !!cameraRef.current);

      // ONLY call stopRecording on the camera - DON'T clean up state yet!
      // The state will be cleaned up in the startRecording's finally block
      // after the video is successfully saved
      if (cameraRef.current && isRecording) {
        console.log('🛑 Calling cameraRef.current.stopRecording()...');
        cameraRef.current.stopRecording();
        console.log('✅ stopRecording() called successfully');
      } else {
        console.log('⚠️ Cannot stop recording - conditions not met');
      }
    } catch (error) {
      console.error('❌ Error in stopRecording function:', error);
    }
  };

  const takePhoto = async () => {
    try {
      console.log('Taking photo...');

      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        console.log('Photo taken:', photo);
        // TODO: Process photo
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Gallery media selected:', result.assets[0]);
        // TODO: Process selected media
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
    }
  };

  const handleFlipCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <X size={20} color="#ffffff" />
          </TouchableOpacity>

          {isRecording ? (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>
                {formatTime(recordingTime)}
              </Text>
            </View>
          ) : (
            <Text style={styles.headerTitle}>Captura Rápida</Text>
          )}

          <TouchableOpacity
            style={[
              styles.headerButton,
              flash === 'on' && styles.flashButtonActive
            ]}
            onPress={toggleFlash}
          >
            {flash === 'on' ? (
              <Zap size={20} color="#000000" />
            ) : (
              <ZapOff size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Controls */}
      <SafeAreaView edges={['bottom']} style={styles.bottomControls}>
        <View style={styles.controlsContainer}>
          {/* Gallery Button */}
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleGallery}
          >
            <Image size={24} color="#ffffff" />
          </TouchableOpacity>

          {/* Capture Button */}
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View
              style={[
                styles.captureButtonOuter,
                {
                  backgroundColor: isRecording ? '#dc2626' : '#ffffff',
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View
                style={[
                  styles.captureButtonInner,
                  isRecording && styles.captureButtonInnerRecording
                ]}
              />
            </Animated.View>
          </Pressable>

          {/* Flip Camera Button */}
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleFlipCamera}
          >
            <RefreshCw size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {isRecording
              ? 'Gravando vídeo...'
              : 'Toque para foto • Segure para vídeo'}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  permissionTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  permissionButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
    justifyContent: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  permissionSecondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  permissionSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashButtonActive: {
    backgroundColor: '#fbbf24',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  recordingIndicator: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  recordingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 64,
    marginBottom: 24,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#000000',
  },
  captureButtonInnerRecording: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderColor: '#ffffff',
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionsText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});
