import { AnimatedSplash } from "@/components/illustrations/AnimatedSplash";
import { useAuth } from "@/contexts/authStore";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync().catch(() => {});

function Nav() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(rider)" />
      <Stack.Screen name="(driver)" />
      <Stack.Screen
        name="verify-ride"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="active-ride" />
      <Stack.Screen
        name="sos"
        options={{ presentation: "fullScreenModal", animation: "fade" }}
      />
      <Stack.Screen name="emergency-contacts" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

function AppShell() {
  const hydrate = useAuth((s) => s.hydrate);
  const hydrated = useAuth((s) => s.hydrated);
  const [splashShown, setSplashShown] = useState(true);

  useEffect(() => {
    hydrate().finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, [hydrate]);

  // Keep the animated splash visible for at least 1.6s so the user actually
  // sees the animation, even if hydration finishes instantly.
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => setSplashShown(false), 2600);
    return () => clearTimeout(t);
  }, [hydrated]);

  return (
    <>
      {hydrated ? <Nav /> : null}
      <AnimatedSplash visible={splashShown} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
