import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { View } from 'react-native';

export function Divider({ vertical, style }: { vertical?: boolean; style?: any }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        vertical
          ? { width: 1, alignSelf: 'stretch', backgroundColor: colors.border }
          : { height: 1, alignSelf: 'stretch', backgroundColor: colors.border },
        style,
      ]}
    />
  );
}
