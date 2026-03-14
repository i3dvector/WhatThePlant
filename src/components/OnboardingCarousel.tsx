import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: 'camera-outline' as const,
    title: 'Snap',
    description: 'Point your camera at any plant and take a photo',
  },
  {
    icon: 'search-outline' as const,
    title: 'Identify',
    description: "We'll identify it instantly using advanced plant recognition",
  },
  {
    icon: 'grid-outline' as const,
    title: 'Collect',
    description: 'Build your personal plant garden and track your discoveries',
  },
];

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    onComplete();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <Pressable style={styles.skipButton} onPress={handleComplete}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={Colors.light.accent} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Get Started button on last slide */}
      {currentIndex === slides.length - 1 ? (
        <Animated.View entering={FadeIn.duration(300)}>
          <Pressable style={styles.getStartedButton} onPress={handleComplete}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <View style={styles.getStartedPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: Spacing.base,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    color: Colors.light.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(82,183,136,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.light.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },
  dotActive: {
    backgroundColor: Colors.light.accent,
    width: 24,
  },
  getStartedButton: {
    backgroundColor: Colors.light.primary,
    marginHorizontal: Spacing.xl,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  getStartedPlaceholder: {
    height: 52 + Spacing['2xl'],
  },
});
