import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';

interface Props {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ label, tone = 'neutral', icon, size = 'md' }: Props) {
  const { colors } = useTheme();

  const map: Record<Tone, { bg: string; fg: string }> = {
    success: { bg: colors.successMuted, fg: colors.success },
    danger: { bg: colors.dangerMuted, fg: colors.danger },
    warning: { bg: colors.warningMuted, fg: colors.warning },
    info: { bg: 'rgba(59,130,246,0.15)', fg: colors.info },
    neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
    primary: { bg: colors.primaryMuted, fg: colors.primary },
  };

  const p = map[tone];
  const heights = size === 'sm' ? 22 : 26;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: p.bg,
        paddingHorizontal: spacing.sm + 2,
        borderRadius: radius.full,
        height: heights,
      }}
    >
      {icon ? <View style={{ marginRight: 5 }}>{icon}</View> : null}
      <Text
        variant={size === 'sm' ? 'caption' : 'caption'}
        style={{ color: p.fg, fontWeight: '700' }}
      >
        {label}
      </Text>
    </View>
  );
}
