import { Stack } from 'expo-router';
import React from 'react';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="register-vehicle" options={{ presentation: 'card' }} />
      <Stack.Screen name="qr-code" options={{ presentation: 'card' }} />
    </Stack>
  );
}
