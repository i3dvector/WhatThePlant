import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { Spacing } from '../constants/spacing';

export function SkeletonCard() {
  const { colors } = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Animated.View
        style={[styles.image, { backgroundColor: colors.border }, animatedStyle]}
        accessibilityLabel="Loading your garden"
        accessibilityRole="progressbar"
      />
      <Animated.View
        style={[styles.textLine, { backgroundColor: colors.border }, animatedStyle]}
      />
      <Animated.View
        style={[styles.textLineShort, { backgroundColor: colors.border }, animatedStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 12,
  },
  textLine: {
    height: 14,
    borderRadius: 4,
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.sm,
    width: '70%',
  },
  textLineShort: {
    height: 10,
    borderRadius: 4,
    marginTop: Spacing.xs,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    width: '40%',
  },
});
