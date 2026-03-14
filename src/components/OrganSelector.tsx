import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import type { PlantOrgan } from '../types';

interface OrganSelectorProps {
  selected: PlantOrgan;
  onSelect: (organ: PlantOrgan) => void;
  onContinue: () => void;
}

const organs = [
  { key: 'leaf' as PlantOrgan, label: 'Leaf', icon: 'leaf-outline' as const },
  { key: 'flower' as PlantOrgan, label: 'Flower', icon: 'flower-outline' as const },
  { key: 'fruit' as PlantOrgan, label: 'Fruit', icon: 'nutrition-outline' as const },
  { key: 'bark' as PlantOrgan, label: 'Bark', icon: 'git-branch-outline' as const },
];

export function OrganSelector({ selected, onSelect, onContinue }: OrganSelectorProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Auto-proceed after 3 seconds if user doesn't interact
    timerRef.current = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onContinue]);

  const handleSelect = (organ: PlantOrgan) => {
    // Reset timer on interaction
    if (timerRef.current) clearTimeout(timerRef.current);
    onSelect(organ);
    // Brief delay then proceed
    timerRef.current = setTimeout(onContinue, 300);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <View style={styles.container}>
        <Text style={styles.title}>What part of the plant?</Text>
        <View style={styles.row}>
          {organs.map((organ) => (
            <Pressable
              key={organ.key}
              style={[
                styles.button,
                selected === organ.key && styles.buttonActive,
              ]}
              onPress={() => handleSelect(organ.key)}
              accessibilityLabel={`Select ${organ.label} as plant organ`}
              accessibilityRole="button"
            >
              <Ionicons
                name={organ.icon}
                size={32}
                color={
                  selected === organ.key ? '#FFFFFF' : 'rgba(255,255,255,0.7)'
                }
              />
              <Text
                style={[
                  styles.label,
                  selected === organ.key && styles.labelActive,
                ]}
              >
                {organ.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  button: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    width: 72,
  },
  buttonActive: {
    borderColor: Colors.light.accent,
    backgroundColor: 'rgba(82,183,136,0.3)',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  continueButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 24,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
