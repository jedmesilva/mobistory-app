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
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
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

  const [permission, requestPermission] = useCameraPermissions();
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

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color={Colors.text.tertiary} />
          <Text style={styles.permissionText}>
            Precisamos de acesso à câmera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
      stopRecording();
    } else {
      // Take photo (quick tap)
      takePhoto();
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      console.log('Starting video recording...');

      // Start recording interval
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      if (cameraRef.current) {
        const video = await cameraRef.current.recordAsync();
        console.log('Video recorded:', video);
        // TODO: Process video
      }
    } catch (error) {
      console.error('Error recording video:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      console.log(`Stopping recording: ${recordingTime} seconds`);

      if (cameraRef.current) {
        await cameraRef.current.stopRecording();
      }

      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingTime(0);
    } catch (error) {
      console.error('Error stopping recording:', error);
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
            style={styles.sideButton}
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
    padding: 32,
    gap: 16,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: Colors.primary.DEFAULT,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background.primary,
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
