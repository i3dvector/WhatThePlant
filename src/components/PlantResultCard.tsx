import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { ConfidenceBadge } from './ConfidenceBadge';
import type { PlantResult } from '../types';

interface PlantResultCardProps {
  result: PlantResult;
  isTopResult: boolean;
}

export function PlantResultCard({ result, isTopResult }: PlantResultCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              isTopResult ? Typography.h1 : Typography.h2,
              { color: colors.text },
            ]}
            numberOfLines={2}
          >
            {result.commonName}
          </Text>
          <Text style={[Typography.subtitle, { color: colors.textMuted }]}>
            {result.scientificName}
          </Text>
        </View>
        <ConfidenceBadge confidence={result.confidence} />
      </View>
      {result.family && (
        <Text style={[Typography.caption, { color: colors.textMuted, marginTop: Spacing.xs }]}>
          Family: {result.family}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  nameContainer: {
    flex: 1,
  },
});
