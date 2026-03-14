import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useCameraStore } from '../stores/cameraStore';
import { useGardenStore } from '../stores/gardenStore';
import { PlantResultCard } from './PlantResultCard';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ResultsSheet() {
  const { colors } = useTheme();
  const { results, capturedImage, selectedOrgan, error, reset } = useCameraStore();
  const { savePlant } = useGardenStore();

  const handleSave = useCallback(async () => {
    if (!results || !capturedImage) return;
    await savePlant(results[0], capturedImage, selectedOrgan, JSON.stringify(results));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    reset();
  }, [results, capturedImage, selectedOrgan, savePlant, reset]);

  const handleShare = useCallback(async () => {
    if (!results) return;
    const top = results[0];
    await Share.share({
      message: `I identified a ${top.commonName} (${top.scientificName}) with ${top.confidence}% confidence using WhatThePlant!`,
    });
  }, [results]);

  const handleTryAnother = useCallback(() => {
    reset();
  }, [reset]);

  if (!results && !error) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15).stiffness(150)}
      exiting={SlideOutDown.duration(300)}
      style={[styles.sheet, { backgroundColor: colors.background }]}
    >
      {/* Drag handle */}
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Captured image thumbnail */}
        {capturedImage && (
          <Image source={{ uri: capturedImage }} style={styles.thumbnail} />
        )}

        {/* Error state */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
            <Text style={[Typography.body, { color: colors.text, textAlign: 'center', marginTop: Spacing.md }]}>
              {error}
            </Text>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleTryAnother}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {/* Results */}
        {results && (
          <>
            {results.map((result, index) => (
              <PlantResultCard
                key={`${result.scientificName}-${index}`}
                result={result}
                isTopResult={index === 0}
              />
            ))}

            {/* Action buttons */}
            <View style={styles.actions}>
              <Pressable
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                accessibilityLabel="Save to Garden"
                accessibilityRole="button"
              >
                <Ionicons name="leaf" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Save to Garden</Text>
              </Pressable>

              <View style={styles.secondaryRow}>
                <Pressable
                  style={[styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={handleShare}
                  accessibilityLabel="Share result"
                  accessibilityRole="button"
                >
                  <Ionicons name="share-outline" size={20} color={colors.text} />
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Share</Text>
                </Pressable>

                <Pressable
                  style={[styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={handleTryAnother}
                  accessibilityLabel="Try another plant"
                  accessibilityRole="button"
                >
                  <Ionicons name="camera-outline" size={20} color={colors.text} />
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Try Another</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: Spacing.base,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  actions: {
    marginTop: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
