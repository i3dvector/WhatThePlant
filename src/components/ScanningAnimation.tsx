import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ScanningAnimation() {
  const translateY = useSharedValue(-20);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(SCREEN_HEIGHT, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // infinite
      false // don't reverse
    );
  }, [translateY]);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.line, lineStyle]} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Identifying plant...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.light.accent,
    shadowColor: Colors.light.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
