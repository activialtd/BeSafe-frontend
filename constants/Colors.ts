/**
 * BeSafe design tokens.
 *
 * Palette rationale:
 *  - Safety green primary: conveys trust, verification, "go".
 *  - Emergency red: reserved for SOS / danger — never used for CTAs.
 *  - Warm orange: friendly accent (highlights, chips, "verified" glow).
 *  - Deep navy black for dark surfaces (better than pure #000 for OLED comfort).
 */

export const palette = {
  // Brand
  green50: '#E6F7EF',
  green100: '#C1EDD6',
  green400: '#22C55E',
  green500: '#00A86B', // primary light
  green600: '#00875A',
  green700: '#046B47',

  greenDark400: '#10B981',
  greenDark500: '#059669',
  greenDark600: '#047857',

  // Accent
  orange400: '#FF8A5C',
  orange500: '#FF6B35',
  orange600: '#E5522A',

  // Emergency
  red400: '#F87171',
  red500: '#EF4444',
  red600: '#DC2626',
  red700: '#B91C1C',

  // Warning / info
  amber500: '#F59E0B',
  blue500: '#3B82F6',

  // Neutrals - light
  white: '#FFFFFF',
  gray50: '#F8F9FB',
  gray100: '#F1F3F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Neutrals - dark scale (deep navy)
  navy950: '#0A0E1A',
  navy900: '#0F1521',
  navy800: '#111827',
  navy700: '#1A2233',
  navy600: '#232D42',
  navy500: '#2A3441',
  navy400: '#3A4657',
};

export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
  // Backgrounds
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  overlay: string;

  // Borders / dividers
  border: string;
  borderStrong: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Brand
  primary: string;
  primaryDark: string;
  primaryMuted: string;
  onPrimary: string;

  // Accent
  accent: string;
  accentMuted: string;

  // Semantic
  danger: string;
  dangerMuted: string;
  warning: string;
  warningMuted: string;
  success: string;
  successMuted: string;
  info: string;

  // Nav
  tabBar: string;
  tabBarInactive: string;

  // Special
  skeleton: string;
  shadow: string;
}

export const Colors: Record<ThemeName, ThemeColors> = {
  light: {
    background: palette.white,
    surface: palette.gray50,
    surfaceElevated: palette.white,
    surfaceMuted: palette.gray100,
    overlay: 'rgba(10, 14, 26, 0.45)',

    border: palette.gray200,
    borderStrong: palette.gray300,

    text: '#0F1419',
    textSecondary: palette.gray600,
    textTertiary: palette.gray400,
    textInverse: palette.white,

    primary: palette.green500,
    primaryDark: palette.green600,
    primaryMuted: palette.green50,
    onPrimary: palette.white,

    accent: palette.orange500,
    accentMuted: '#FFECDF',

    danger: palette.red500,
    dangerMuted: '#FEE2E2',
    warning: palette.amber500,
    warningMuted: '#FEF3C7',
    success: palette.green500,
    successMuted: palette.green50,
    info: palette.blue500,

    tabBar: palette.white,
    tabBarInactive: palette.gray400,

    skeleton: palette.gray200,
    shadow: 'rgba(15, 20, 25, 0.08)',
  },
  dark: {
    background: palette.navy950,
    surface: palette.navy900,
    surfaceElevated: palette.navy800,
    surfaceMuted: palette.navy700,
    overlay: 'rgba(0, 0, 0, 0.65)',

    border: palette.navy600,
    borderStrong: palette.navy500,

    text: '#F5F7FB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textInverse: palette.navy950,

    primary: palette.greenDark400,
    primaryDark: palette.greenDark500,
    primaryMuted: 'rgba(16, 185, 129, 0.15)',
    onPrimary: palette.white,

    accent: palette.orange400,
    accentMuted: 'rgba(255, 138, 92, 0.15)',

    danger: palette.red400,
    dangerMuted: 'rgba(248, 113, 113, 0.15)',
    warning: '#FBBF24',
    warningMuted: 'rgba(251, 191, 36, 0.15)',
    success: palette.greenDark400,
    successMuted: 'rgba(16, 185, 129, 0.15)',
    info: '#60A5FA',

    tabBar: palette.navy900,
    tabBarInactive: palette.gray500,

    skeleton: palette.navy700,
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
};

export type ColorKey = keyof ThemeColors;
