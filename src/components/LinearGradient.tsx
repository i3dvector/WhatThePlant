import React from 'react';
import { View, StyleSheet } from 'react-native';

interface LinearGradientProps {
  position: 'top' | 'bottom';
}

export function LinearGradient({ position }: LinearGradientProps) {
  return (
    <View
      style={[
        styles.gradient,
        position === 'top' ? styles.top : styles.bottom,
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  top: {
    top: 0,
    backgroundColor: 'transparent',
    // Using a simple semi-transparent overlay since we can't use expo-linear-gradient without extra deps
    // The camera screen has overlaid controls that benefit from this
    borderBottomWidth: 0,
    // Simulated gradient via layered views would be complex; using a simple approach
    opacity: 0,
  },
  bottom: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
