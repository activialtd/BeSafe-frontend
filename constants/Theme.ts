import { Platform } from 'react-native';

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
  '5xl': 72,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 999,
};

export const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    semibold: 'sans-serif-medium',
    bold: 'sans-serif',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
})!;

export const typography = {
  displayLg: { fontSize: 40, lineHeight: 48, fontWeight: '800' as const, letterSpacing: -0.8 },
  displayMd: { fontSize: 32, lineHeight: 40, fontWeight: '800' as const, letterSpacing: -0.6 },
  displaySm: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const, letterSpacing: -0.4 },
  h1: { fontSize: 26, lineHeight: 34, fontWeight: '700' as const, letterSpacing: -0.3 },
  h2: { fontSize: 22, lineHeight: 30, fontWeight: '700' as const, letterSpacing: -0.2 },
  h3: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  h4: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  bodyLg: { fontSize: 17, lineHeight: 26, fontWeight: '400' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodySm: { fontSize: 13, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '500' as const, letterSpacing: 0.2 },
  overline: { fontSize: 11, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  button: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const, letterSpacing: 0.2 },
  buttonSm: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const, letterSpacing: 0.1 },
};

export const shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
    },
    android: { elevation: 12 },
    default: {},
  }),
};

export const durations = {
  fast: 150,
  base: 250,
  slow: 400,
  slower: 600,
};
