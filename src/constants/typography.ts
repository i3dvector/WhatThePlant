import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  badge: {
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};
