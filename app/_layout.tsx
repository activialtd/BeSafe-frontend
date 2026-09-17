import { AnimatedSplash } from "@/components/illustrations/AnimatedSplash";
import { useAuth } from "@/contexts/authStore";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Stack, useRouter, useSegments } from "expo-router"; // Added router hooks
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
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
  const user = useAuth((s) => s.user); // Added user state
  const [splashShown, setSplashShown] = useState(true);

  const segments = useSegments(); // Tracks the current folder path
  const router = useRouter();

  useEffect(() => {
    hydrate().finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => setSplashShown(false), 2600);
    return () => clearTimeout(t);
  }, [hydrated]);

  // === THE GLOBAL AUTH GUARD ===
  useEffect(() => {
    if (!hydrated) return;

    const inOnboardingGroup = segments[0] === "(onboarding)";

    // Use a tiny timeout to ensure Expo Router has finished mounting the tree
    setTimeout(() => {
      if (!user && !inOnboardingGroup) {
        // 1. Not logged in? Kick to welcome screen.
        router.replace("/(onboarding)/welcome");
      } else if (user) {
        // 2. Logged in? Ensure they are in the correct dashboard.
        const inDriverGroup = segments[0] === "(driver)";
        const inRiderGroup = segments[0] === "(rider)";

        if (user.role === "driver" && !inDriverGroup) {
          router.replace("/(driver)/(tabs)");
        } else if (user.role === "rider" && !inRiderGroup) {
          router.replace("/(rider)/(tabs)");
        }
      }
    }, 10);
  }, [user, hydrated, segments]);

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
