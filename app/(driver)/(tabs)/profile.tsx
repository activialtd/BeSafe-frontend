import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/authStore';
import { driverService } from '@/services/driver.service';
import { Driver } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';

export default function DriverProfile() {
  const { colors, theme, toggle } = useTheme();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    driverService.getProfile().then(setDriver);
  }, []);

  const rows: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    destructive?: boolean;
    right?: React.ReactNode;
  }[] = [
    { icon: 'car-sport', label: 'Manage vehicles', onPress: () => router.push('/(driver)/register-vehicle') },
    { icon: 'shield-checkmark', label: 'Verification status', onPress: () => {} },
    { icon: 'cash', label: 'Payouts', onPress: () => {} },
    { icon: 'moon', label: 'Dark mode', onPress: toggle, right: <Text variant="bodySm" color="textSecondary">{theme === 'dark' ? 'On' : 'Off'}</Text> },
    { icon: 'settings', label: 'Settings', onPress: () => router.push('/settings') },
    { icon: 'help-circle', label: 'Help & support', onPress: () => {} },
    { icon: 'log-out', label: 'Sign out', destructive: true, onPress: async () => { await signOut(); router.replace('/'); } },
  ];

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: 100 }}>
      <Text variant="displaySm" style={{ paddingTop: spacing.md, marginBottom: spacing.lg }}>Profile</Text>

      <Card padding="lg" style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {driver?.photoUrl ? (
            <Image source={{ uri: driver.photoUrl }} style={{ width: 68, height: 68, borderRadius: 34 }} />
          ) : (
            <View
              style={{
                width: 68, height: 68, borderRadius: 34,
                backgroundColor: colors.primaryMuted,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text variant="h1" color="primary">{user?.fullName?.[0] ?? 'D'}</Text>
            </View>
          )}
          <View style={{ flex: 1, marginLeft: spacing.base }}>
            <Text variant="h3">{driver?.fullName ?? user?.fullName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text variant="bodySm" style={{ fontWeight: '700' }}>{driver?.rating.toFixed(1) ?? '—'}</Text>
              <Text variant="bodySm" color="textSecondary">· {driver?.totalTrips ?? 0} trips</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 6, gap: 6 }}>
              <Badge tone="success" size="sm" label="NIN verified" />
              <Badge tone="success" size="sm" label="BG check" />
            </View>
          </View>
        </View>
      </Card>

      <Card padding="xs" style={{ marginBottom: spacing.lg, paddingVertical: 8, paddingHorizontal: 8 }}>
        {rows.map((row) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={({ pressed }) => ({
              flexDirection: 'row', alignItems: 'center',
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
            })}
          >
            <View
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: row.destructive ? colors.dangerMuted : colors.primaryMuted,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name={row.icon} size={18} color={row.destructive ? colors.danger : colors.primary} />
            </View>
            <Text variant="body" style={{ flex: 1, fontWeight: '600' }} color={row.destructive ? 'danger' : 'text'}>
              {row.label}
            </Text>
            {row.right ?? <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
          </Pressable>
        ))}
      </Card>

      <Text variant="caption" color="textTertiary" style={{ textAlign: 'center' }}>
        BeSafe · v1.0.0
      </Text>
    </Screen>
  );
}
