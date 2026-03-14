export const Colors = {
  light: {
    primary: '#2D6A4F',
    accent: '#52B788',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1F2937',
    textMuted: '#5B6370',
    error: '#EF4444',
    overlay: 'rgba(0,0,0,0.5)',
    border: '#E5E7EB',
  },
  dark: {
    primary: '#2D6A4F',
    accent: '#52B788',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    error: '#EF4444',
    overlay: 'rgba(0,0,0,0.7)',
    border: '#374151',
  },
};

export type ThemeColors = typeof Colors.light;
