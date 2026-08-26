import { radius, shadow, spacing, typography } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  full?: boolean;
  haptic?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  leftIcon,
  rightIcon,
  full = true,
  haptic = true,
}: Props) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const heights: Record<Size, number> = { sm: 40, md: 52, lg: 60 };
  const paddings: Record<Size, number> = { sm: spacing.base, md: spacing.lg, lg: spacing.xl };
  const fontSizes: Record<Size, number> = { sm: 14, md: 16, lg: 17 };

  const palette = (() => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, fg: colors.onPrimary, border: colors.primary };
      case 'secondary':
        return { bg: colors.surfaceElevated, fg: colors.text, border: colors.border };
      case 'ghost':
        return { bg: 'transparent', fg: colors.text, border: 'transparent' };
      case 'danger':
        return { bg: colors.danger, fg: '#FFFFFF', border: colors.danger };
      case 'outline':
        return { bg: 'transparent', fg: colors.primary, border: colors.primary };
    }
  })();

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  };
  const handlePress = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, full && { alignSelf: 'stretch' }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          {
            height: heights[size],
            paddingHorizontal: paddings[size],
            borderRadius: radius.lg,
            backgroundColor: palette.bg,
            borderColor: palette.border,
            borderWidth: variant === 'outline' || variant === 'secondary' ? 1 : 0,
            opacity: disabled ? 0.5 : 1,
          },
          variant === 'primary' || variant === 'danger' ? shadow.md : undefined,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={palette.fg} />
        ) : (
          <View style={styles.row}>
            {leftIcon ? <View style={{ marginRight: 10 }}>{leftIcon}</View> : null}
            <Text
              style={{
                ...typography.button,
                fontSize: fontSizes[size],
                color: palette.fg,
              }}
            >
              {label}
            </Text>
            {rightIcon ? <View style={{ marginLeft: 10 }}>{rightIcon}</View> : null}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
