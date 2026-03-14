import React, { useCallback, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useCameraStore } from '../src/stores/cameraStore';
import { usePlantIdentification } from '../src/hooks/usePlantIdentification';
import { ShutterButton } from '../src/components/ShutterButton';
import { OrganSelector } from '../src/components/OrganSelector';
import { ScanningAnimation } from '../src/components/ScanningAnimation';
import { ResultsSheet } from '../src/components/ResultsSheet';
import { PermissionScreen } from '../src/components/PermissionScreen';
import { Spacing } from '../src/constants/spacing';
import { LinearGradient } from '../src/components/LinearGradient';

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const {
    capturedImage,
    showOrganSelector,
    isIdentifying,
    results,
    error,
    selectedOrgan,
    setCapturedImage,
    setShowOrganSelector,
    setSelectedOrgan,
    reset,
  } = useCameraStore();
  const { identify } = usePlantIdentification();

  // Permission not yet determined or denied
  if (!permission) return null;

  if (!permission.granted) {
    return (
      <PermissionScreen
        onRequest={requestPermission}
        canAskAgain={permission.canAskAgain}
      />
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        setCapturedImage(photo.uri);
        setShowOrganSelector(true);
      }
    } catch (err) {
      console.error('Failed to take picture:', err);
    }
  };

  const handleGalleryPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      setShowOrganSelector(true);
    }
  };

  const handleOrganContinue = () => {
    identify();
  };

  return (
    <View style={styles.container}>
      {/* Camera or frozen frame */}
      {capturedImage ? (
        <Image source={{ uri: capturedImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        />
      )}

      {/* Top gradient overlay */}
      <LinearGradient position="top" />

      {/* Bottom gradient overlay */}
      <LinearGradient position="bottom" />

      {/* Scanning animation */}
      {isIdentifying && <ScanningAnimation />}

      {/* Organ selector overlay */}
      {showOrganSelector && (
        <OrganSelector
          selected={selectedOrgan}
          onSelect={setSelectedOrgan}
          onContinue={handleOrganContinue}
        />
      )}

      {/* Results / error bottom sheet */}
      {(results || error) && !isIdentifying && <ResultsSheet />}

      {/* Bottom controls — only show when camera is active */}
      {!capturedImage && !isIdentifying && (
        <View style={styles.controls}>
          {/* Gallery button */}
          <Pressable
            style={styles.iconButton}
            onPress={handleGalleryPick}
            accessibilityLabel="Pick from gallery"
            accessibilityRole="button"
          >
            <Ionicons name="images-outline" size={28} color="#FFFFFF" />
          </Pressable>

          {/* Shutter button */}
          <ShutterButton onPress={handleCapture} />

          {/* Garden button */}
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/garden')}
            accessibilityLabel="My Garden"
            accessibilityRole="button"
          >
            <Ionicons name="leaf-outline" size={28} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
