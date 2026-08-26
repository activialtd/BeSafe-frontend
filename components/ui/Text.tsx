import { ColorKey } from '@/constants/Colors';
import { typography } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Text as RNText, StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

type Variant = keyof typeof typography;

interface Props extends RNTextProps {
  variant?: Variant;
  color?: ColorKey;
  align?: 'left' | 'center' | 'right';
  weight?: '400' | '500' | '600' | '700' | '800';
  style?: StyleProp<TextStyle>;
}

export function Text({
  variant = 'body',
  color = 'text',
  align,
  weight,
  style,
  children,
  ...rest
}: Props) {
  const { colors } = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        typography[variant],
        { color: colors[color] },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
