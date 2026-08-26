import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/authStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';

export default function SettingsScreen() {
  const { colors, theme, pref, setPref } = useTheme();
  const signOut = useAuth((s) => s.signOut);
  const [notifs, setNotifs] = useState(true);
  const [sosSounds, setSosSounds] = useState(true);
  const [autoShare, setAutoShare] = useState(true);

  const options: { id: 'system' | 'light' | 'dark'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'system', label: 'System', icon: 'phone-portrait' },
    { id: 'light', label: 'Light', icon: 'sunny' },
    { id: 'dark', label: 'Dark', icon: 'moon' },
  ];

  return (
    <Screen scroll>
      <Header title="Settings" />

      {/* Appearance */}
      <Text variant="caption" color="textSecondary" style={{ letterSpacing: 1, marginBottom: 8, fontWeight: '700' }}>
        APPEARANCE
      </Text>
      <Card padding="sm" style={{ marginBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', gap: 8, padding: 4 }}>
          {options.map((o) => {
            const active = pref === o.id;
            return (
              <Pressable
                key={o.id}
                onPress={() => setPref(o.id)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: radius.md,
                  backgroundColor: active ? colors.primary : colors.surfaceMuted,
                  alignItems: 'center',
                }}
              >
                <Ionicons name={o.icon} size={20} color={active ? '#fff' : colors.text} />
                <Text
                  variant="bodySm"
                  style={{ marginTop: 6, fontWeight: '600', color: active ? '#fff' : colors.text }}
                >
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Safety */}
      <Text variant="caption" color="textSecondary" style={{ letterSpacing: 1, marginBottom: 8, fontWeight: '700' }}>
        SAFETY
      </Text>
      <Card padding="sm" style={{ marginBottom: spacing.xl }}>
        <ToggleRow
          icon="notifications"
          label="Ride notifications"
          hint="Get alerts about verifications and shared trips"
          value={notifs}
          onValueChange={setNotifs}
          colors={colors}
        />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <ToggleRow
          icon="volume-high"
          label="SOS siren"
          hint="Play loud siren when SOS is triggered"
          value={sosSounds}
          onValueChange={setSosSounds}
          colors={colors}
        />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <ToggleRow
          icon="share-social"
          label="Auto-share with all contacts"
          hint="Share every ride automatically with your emergency contacts"
          value={autoShare}
          onValueChange={setAutoShare}
          colors={colors}
        />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <LinkRow
          icon="people"
          label="Emergency contacts"
          onPress={() => router.push('/emergency-contacts')}
          colors={colors}
        />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <LinkRow
          icon="key"
          label="Change safety PIN"
          onPress={() => {}}
          colors={colors}
        />
      </Card>

      {/* Account */}
      <Text variant="caption" color="textSecondary" style={{ letterSpacing: 1, marginBottom: 8, fontWeight: '700' }}>
        ACCOUNT
      </Text>
      <Card padding="sm" style={{ marginBottom: spacing.xl }}>
        <LinkRow icon="shield-checkmark" label="Verification & documents" onPress={() => {}} colors={colors} />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <LinkRow icon="lock-closed" label="Privacy & data" onPress={() => {}} colors={colors} />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <LinkRow icon="document-text" label="Terms & policies" onPress={() => {}} colors={colors} />
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 14 }} />
        <LinkRow
          icon="log-out"
          label="Sign out"
          destructive
          onPress={async () => { await signOut(); router.replace('/'); }}
          colors={colors}
        />
      </Card>

      <Text variant="caption" color="textTertiary" style={{ textAlign: 'center' }}>
        BeSafe · v1.0.0
      </Text>
    </Screen>
  );
}

function ToggleRow({ icon, label, hint, value, onValueChange, colors }: any) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
      <View
        style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: colors.primaryMuted,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text variant="body" style={{ fontWeight: '600' }}>{label}</Text>
        {hint ? <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} />
    </View>
  );
}

function LinkRow({ icon, label, onPress, destructive, colors }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center',
        padding: 14,
        backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
      })}
    >
      <View
        style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: destructive ? colors.dangerMuted : colors.primaryMuted,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={destructive ? colors.danger : colors.primary} />
      </View>
      <Text variant="body" style={{ flex: 1, fontWeight: '600', color: destructive ? colors.danger : colors.text }}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}
