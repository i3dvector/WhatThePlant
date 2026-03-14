import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingCarousel } from '../src/components/OnboardingCarousel';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then((val) => {
      setShowOnboarding(val !== 'true');
    });
  }, []);

  // Still loading onboarding state
  if (showOnboarding === null) return null;

  if (showOnboarding) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <OnboardingCarousel onComplete={() => setShowOnboarding(false)} />
      </>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
