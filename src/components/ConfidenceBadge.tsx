import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const bgColor =
    confidence >= 70
      ? Colors.light.accent
      : confidence >= 40
        ? '#F59E0B'
        : Colors.light.error;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>{confidence}% Match</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.badge,
    color: '#FFFFFF',
  },
});
