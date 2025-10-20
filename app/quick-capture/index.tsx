import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Alert,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import {
  Camera as CameraIcon,
  Image,
  RefreshCw,
  X,
  Zap,
  ZapOff,
  Check,
} from 'lucide-react-native';
import { Colors } from '@/constants';

export default function QuickCaptureScreen() {
  const router = useRouter();
  const cameraRef = useRef<Camera>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTime = useRef<number | null>(null);

  const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicrophonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();

  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [lastMediaUri, setLastMediaUri] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ uri: string; type: 'photo' | 'video' } | null>(null);

  const device = useCameraDevice(cameraPosition);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Check if device supports flash
  const supportsFlash = device?.hasFlash ?? false;

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

  // Load last media from gallery
  useEffect(() => {
    loadLastMedia();
  }, [mediaLibraryPermission?.granted]);

  // Disable flash when switching to front camera (most front cameras don't have flash)
  useEffect(() => {
    if (cameraPosition === 'front' && !supportsFlash) {
      setFlash('off');
    }
  }, [cameraPosition, supportsFlash]);

  const loadLastMedia = async () => {
    if (mediaLibraryPermission?.granted) {
      try {
        const media = await MediaLibrary.getAssetsAsync({
          first: 1,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        });

        if (media.assets.length > 0) {
          setLastMediaUri(media.assets[0].uri);
        }
      } catch (error) {
        console.error('Error loading last media:', error);
      }
    }
  };

  const requestAllPermissions = async () => {
    await requestCameraPermission();
    await requestMicrophonePermission();
    await requestMediaLibraryPermission();
  };

  if (!hasCameraPermission || !hasMicrophonePermission) {
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
            <CameraIcon size={80} color="#ffffff" strokeWidth={1.5} />
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
            <CameraIcon size={20} color="#000000" />
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

  if (device == null) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Câmera não disponível</Text>
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

      // Minimum 2 seconds for reliable video recording (camera needs time to capture frames)
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

      // Start recording
      // Only use flash if device supports it and flash is enabled
      const shouldUseFlash = supportsFlash && flash === 'on';

      await cameraRef.current.startRecording({
        flash: shouldUseFlash ? 'on' : 'off',
        onRecordingFinished: async (video) => {
          console.log('✅ Video gravado com sucesso!');
          console.log('📁 URI:', video.path);
          console.log('📦 Duração:', video.duration, 'segundos');

          // Clean up
          recordingStartTime.current = null;
          setIsRecording(false);
          setRecordingTime(0);
          if (recordingInterval.current) {
            clearInterval(recordingInterval.current);
            recordingInterval.current = null;
          }

          // Show preview immediately
          setPreviewMedia({ uri: `file://${video.path}`, type: 'video' });

          // Save video to media library
          try {
            if (mediaLibraryPermission?.granted) {
              const asset = await MediaLibrary.createAssetAsync(`file://${video.path}`);
              console.log('💾 Video saved to gallery:', asset.uri);
              setLastMediaUri(asset.uri);
            } else {
              console.log('⚠️ Media library permission not granted, requesting...');
              await requestMediaLibraryPermission();
            }
          } catch (saveError) {
            console.error('❌ Error saving video:', saveError);
          }
        },
        onRecordingError: (error) => {
          console.error('❌ Erro ao gravar vídeo:', error);

          // Clean up
          recordingStartTime.current = null;
          setIsRecording(false);
          setRecordingTime(0);
          if (recordingInterval.current) {
            clearInterval(recordingInterval.current);
            recordingInterval.current = null;
          }
        },
      });

    } catch (error) {
      console.error('❌ Error starting video recording:', error);
      setIsRecording(false);
      recordingStartTime.current = null;
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
      setRecordingTime(0);
    }
  };

  const stopRecording = async () => {
    try {
      const actualRecordingTime = recordingStartTime.current
        ? (Date.now() - recordingStartTime.current) / 1000
        : 0;
      console.log(`⏹️ Stopping recording: ${actualRecordingTime.toFixed(2)} seconds`);

      if (cameraRef.current && isRecording) {
        console.log('🛑 Calling stopRecording()...');
        await cameraRef.current.stopRecording();
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
      console.log('📸 Taking photo...');
      console.log('Flash support:', supportsFlash, '| Flash setting:', flash, '| Camera:', cameraPosition);

      if (cameraRef.current) {
        // Only use flash if device supports it and flash is enabled
        const shouldUseFlash = supportsFlash && flash === 'on';

        const photo = await cameraRef.current.takePhoto({
          flash: shouldUseFlash ? 'on' : 'off',
          enableShutterSound: Platform.OS === 'ios',
        });

        console.log('✅ Photo taken:', photo.path);

        // Show preview immediately
        setPreviewMedia({ uri: `file://${photo.path}`, type: 'photo' });

        // Save to media library
        if (mediaLibraryPermission?.granted) {
          const asset = await MediaLibrary.createAssetAsync(`file://${photo.path}`);
          console.log('💾 Photo saved to gallery:', asset.uri);
          setLastMediaUri(asset.uri);
        } else {
          console.log('⚠️ Media library permission not granted, requesting...');
          await requestMediaLibraryPermission();
        }
      }
    } catch (error) {
      console.error('❌ Error taking photo:', error);
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
    setCameraPosition(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Preview Screen
  if (previewMedia) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="light" />

        {/* Preview Header */}
        <View style={styles.previewHeader}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setPreviewMedia(null)}
          >
            <X size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {previewMedia.type === 'photo' ? 'Foto' : 'Vídeo'}
          </Text>
          <View style={styles.headerButton} />
        </View>

        {/* Preview Media Container */}
        <View style={styles.previewMediaContainer}>
          {previewMedia.type === 'photo' ? (
            <RNImage
              source={{ uri: previewMedia.uri }}
              style={styles.previewMedia}
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{ uri: previewMedia.uri }}
              style={styles.previewMedia}
              useNativeControls={false}
              resizeMode="contain"
              shouldPlay
              isLooping
            />
          )}
        </View>

        {/* Preview Bottom Actions */}
        <View style={styles.previewActions}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => setPreviewMedia(null)}
          >
            <Text style={styles.previewButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewButton, styles.previewButtonPrimary]}
            onPress={() => {
              setPreviewMedia(null);
              // TODO: Navigate to next screen or process media
            }}
          >
            <Check size={20} color="#000000" />
            <Text style={[styles.previewButtonText, styles.previewButtonTextPrimary]}>
              Usar {previewMedia.type === 'photo' ? 'Foto' : 'Vídeo'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Camera View */}
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={!previewMedia}
        photo={true}
        video={true}
        audio={hasMicrophonePermission}
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
              flash === 'on' && styles.flashButtonActive,
              !supportsFlash && styles.flashButtonDisabled
            ]}
            onPress={supportsFlash ? toggleFlash : undefined}
            disabled={!supportsFlash}
          >
            {flash === 'on' ? (
              <Zap size={20} color="#000000" />
            ) : (
              <ZapOff
                size={20}
                color={supportsFlash ? "#ffffff" : "#666666"}
              />
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
            {lastMediaUri ? (
              <RNImage
                source={{ uri: lastMediaUri }}
                style={styles.galleryThumbnail}
              />
            ) : (
              <Image size={24} color="#ffffff" />
            )}
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
  flashButtonDisabled: {
    opacity: 0.5,
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
    overflow: 'hidden',
  },
  galleryThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  previewMediaContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewMedia: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#000000',
    gap: 16,
  },
  previewButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewButtonPrimary: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    gap: 8,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  previewButtonTextPrimary: {
    color: '#000000',
  },
});
