import { LogoMark } from '@/components/ui/Logo';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/contexts/authStore';
import { Redirect } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

export default function Index() {
  const user = useAuth((s) => s.user);

  if (!user) return <Redirect href="/(onboarding)/welcome" />;
  if (user.role === 'driver') return <Redirect href="/(driver)/(tabs)" />;
  return <Redirect href="/(rider)/(tabs)" />;

  // eslint-disable-next-line no-unreachable
  return (
    <Screen padding={false} bg="background">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <LogoMark size={80} />
        </MotiView>
        <Text variant="h2" style={{ marginTop: 24 }}>BeSafe</Text>
      </View>
    </Screen>
  );
}
