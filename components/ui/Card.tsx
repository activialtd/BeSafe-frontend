import { radius, shadow, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

interface Props extends ViewProps {
  elevated?: boolean;
  bordered?: boolean;
  padding?: keyof typeof spacing | number;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  elevated = true,
  bordered = false,
  padding = 'base',
  style,
  children,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const p = typeof padding === 'number' ? padding : spacing[padding];
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surfaceElevated,
          borderRadius: radius.xl,
          padding: p,
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border,
        },
        elevated ? shadow.sm : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}
