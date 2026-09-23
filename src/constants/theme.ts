import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#F5B800',
    secondary: '#111111',
    text: '#111111',
    textSecondary: '#6C757D',
    background: '#F8F9FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E9ECEF',
    border: '#E9ECEF',
    success: '#2EC4B6',
    warning: '#F5B800',
    danger: '#E63946',
  },
  dark: {
    primary: '#FFD700',
    secondary: '#111111',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    background: '#111111',
    backgroundElement: '#1E1E1E',
    backgroundSelected: '#2C2C2C',
    border: '#2C2C2C',
    success: '#2EC4B6',
    warning: '#FFD700',
    danger: '#E63946',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
