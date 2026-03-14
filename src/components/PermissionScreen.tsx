import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { useTheme } from '../hooks/useTheme';

interface PermissionScreenProps {
  onRequest: () => void;
  canAskAgain: boolean;
}

export function PermissionScreen({ onRequest, canAskAgain }: PermissionScreenProps) {
  const { colors } = useTheme();

  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera-outline" size={48} color={Colors.light.accent} />
          <Ionicons
            name="leaf"
            size={24}
            color={Colors.light.primary}
            style={styles.leafIcon}
          />
        </View>

        <Text style={[Typography.h2, { color: colors.text, textAlign: 'center' }]}>
          Let's Identify Some Plants!
        </Text>

        <Text
          style={[
            Typography.body,
            { color: colors.textMuted, textAlign: 'center', marginTop: Spacing.md },
          ]}
        >
          WhatThePlant needs camera access to identify plants from photos. Your photos are processed securely and never stored on our servers.
        </Text>

        {canAskAgain ? (
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={onRequest}
            accessibilityLabel="Grant Camera Access"
            accessibilityRole="button"
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Grant Camera Access</Text>
          </Pressable>
        ) : (
          <>
            <Text
              style={[
                Typography.body,
                {
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: Spacing.base,
                },
              ]}
            >
              Camera access is required to identify plants. You can enable it in your device settings.
            </Text>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={openSettings}
              accessibilityLabel="Open Settings"
              accessibilityRole="button"
            >
              <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Open Settings</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    maxWidth: 340,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(82,183,136,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  leafIcon: {
    position: 'absolute',
    top: 20,
    right: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: Spacing.lg,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
