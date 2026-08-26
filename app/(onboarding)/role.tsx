import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius, shadow, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/authStore';
import { UserRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

export default function RoleScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const setPendingRole = useAuth((s) => s.setPendingRole);

  const confirm = () => {
    if (!selected) return;
    setPendingRole(selected);
    router.push('/(onboarding)/phone');
  };

  return (
    <Screen>
      <Header />
      <Text variant="displaySm">How will you{'\n'}use BeSafe?</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: spacing.sm }}>
        Both roles are verified. Both are trackable. Everyone stays safe.
      </Text>

      <View style={{ marginTop: spacing['2xl'], gap: spacing.base, flex: 1 }}>
        <RoleCard
          role="rider"
          selected={selected === 'rider'}
          onSelect={() => setSelected('rider')}
          icon="person"
          title="I'm a rider"
          desc="Verify buses, taxis and ride vehicles before you enter. Share your trip. Trigger SOS."
          highlights={['Scan vehicle QR codes', 'Live trip sharing', 'Panic button']}
          bg={colors.primaryMuted}
          fg={colors.primary}
        />
        <RoleCard
          role="driver"
          selected={selected === 'driver'}
          onSelect={() => setSelected('driver')}
          icon="car-sport"
          title="I'm a driver"
          desc="Register your vehicle, get a verified QR code passengers can scan, and earn trust."
          highlights={['Vehicle registration', 'Downloadable QR', 'Driver rating']}
          bg={colors.accentMuted}
          fg={colors.accent}
        />
      </View>

      <Button label="Continue" disabled={!selected} onPress={confirm} />
    </Screen>
  );
}

function RoleCard(props: {
  role: UserRole;
  selected: boolean;
  onSelect: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  highlights: string[];
  bg: string;
  fg: string;
}) {
  const { colors } = useTheme();
  return (
    <MotiView
      animate={{ scale: props.selected ? 1 : 0.99 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      <Pressable onPress={props.onSelect}>
        <View
          style={[
            {
              borderRadius: radius.xl,
              backgroundColor: colors.surfaceElevated,
              padding: spacing.lg,
              borderWidth: 2,
              borderColor: props.selected ? props.fg : colors.border,
            },
            props.selected && shadow.md,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 56, height: 56, borderRadius: 28,
                backgroundColor: props.bg,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name={props.icon} size={28} color={props.fg} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.base }}>
              <Text variant="h3">{props.title}</Text>
              <Text variant="bodySm" color="textSecondary" style={{ marginTop: 2 }}>{props.desc}</Text>
            </View>
            {props.selected && (
              <Ionicons name="checkmark-circle" size={26} color={props.fg} />
            )}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, gap: 6 }}>
            {props.highlights.map((h) => (
              <View
                key={h}
                style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: radius.full,
                  backgroundColor: colors.surfaceMuted,
                }}
              >
                <Text variant="caption" color="textSecondary">{h}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </MotiView>
  );
}
