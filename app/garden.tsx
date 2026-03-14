import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGardenStore } from '../src/stores/gardenStore';
import { useTheme } from '../src/hooks/useTheme';
import { SkeletonCard } from '../src/components/SkeletonCard';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import { formatDate } from '../src/utils/format';
import type { SavedPlant } from '../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.base * 2 - Spacing.sm) / 2;

export default function GardenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { plants, isLoading, loadPlants } = useGardenStore();

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const renderPlantCard = ({ item }: { item: SavedPlant }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardName, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.commonName}
        </Text>
        <Text style={[Typography.caption, { color: colors.textMuted }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonRow}>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="flower-outline" size={64} color={colors.textMuted} />
      </View>
      <Text style={[Typography.h2, { color: colors.text, textAlign: 'center' }]}>
        Your garden is empty!
      </Text>
      <Text
        style={[
          Typography.body,
          { color: colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
        ]}
      >
        Go outside and snap a photo to get started.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Text style={[Typography.h2, { color: colors.text }]}>My Garden</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.listContent}>
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
        </View>
      ) : plants.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={plants}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPlantCard}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.base,
  },
  columnWrapper: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
  },
  cardInfo: {
    padding: Spacing.sm,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
});
