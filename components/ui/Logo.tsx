import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Text } from './Text';

interface Props {
  size?: number;
  withWord?: boolean;
  color?: string;
}

export function LogoMark({ size = 40, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  const primary = color ?? colors.primary;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={primary} />
          <Stop offset="1" stopColor={primary} stopOpacity="0.7" />
        </LinearGradient>
      </Defs>
      {/* Shield */}
      <Path
        d="M24 3.5C24 3.5 8 8 8 12v11c0 9 7.2 17 16 21.5C32.8 40 40 32 40 23V12c0-4-16-8.5-16-8.5Z"
        fill="url(#lg)"
      />
      {/* Check */}
      <Path
        d="M16.5 24.5l5 5 10-11"
        stroke="#fff"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function Logo({ size = 40, withWord = true, color }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <LogoMark size={size} color={color} />
      {withWord ? (
        <Text
          style={{
            marginLeft: 10,
            fontSize: size * 0.65,
            fontWeight: '800',
            color: color ?? colors.text,
            letterSpacing: -0.5,
          }}
        >
          Be<Text style={{ color: color ?? colors.primary, fontSize: size * 0.65, fontWeight: '800' }}>Safe</Text>
        </Text>
      ) : null}
    </View>
  );
}
