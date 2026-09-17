import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  right?: React.ReactNode;
};

export default function ProfileScreen() {
  const { colors, theme, toggle } = useTheme();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);

  const rows: Row[] = [
    {
      icon: "people",
      label: "Emergency contacts",
      onPress: () => router.push("/emergency-contacts"),
    },
    {
      icon: "shield-checkmark",
      label: "Verification status",
      onPress: () => {},
    },
    { icon: "notifications", label: "Notifications", onPress: () => {} },
    {
      icon: "moon",
      label: "Dark mode",
      onPress: toggle,
      right: (
        <Text variant="bodySm" color="textSecondary">
          {theme === "dark" ? "On" : "Off"}
        </Text>
      ),
    },
    { icon: "lock-closed", label: "Privacy & data", onPress: () => {} },
    { icon: "help-circle", label: "Help & support", onPress: () => {} },
    {
      icon: "log-out",
      label: "Sign out",
      destructive: true,
      onPress: async () => {
        try {
          await signOut();
          if (router.canDismiss()) {
            router.dismissAll();
          }
          router.replace("/(onboarding)/phone");
        } catch (e) {
          console.error("Logout failed:", e);
        }
      },
    },
  ];

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: 100 }}>
      <Text
        variant="displaySm"
        style={{ paddingTop: spacing.md, marginBottom: spacing.lg }}
      >
        Profile
      </Text>

      {/* User card */}
      <Card padding="lg" style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {user?.photoUrl ? (
            <Image
              source={{ uri: user.photoUrl }}
              style={{ width: 68, height: 68, borderRadius: 34 }}
            />
          ) : (
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                backgroundColor: colors.primaryMuted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text variant="h1" color="primary">
                {user?.fullName?.[0] ?? "U"}
              </Text>
            </View>
          )}
          <View style={{ flex: 1, marginLeft: spacing.base }}>
            <Text variant="h3">{user?.fullName}</Text>
            <Text variant="bodySm" color="textSecondary">
              {user?.phone}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
              <Badge
                tone="success"
                size="sm"
                label="Verified"
                icon={
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color={colors.success}
                  />
                }
              />
              <Badge tone="primary" size="sm" label="Rider" />
            </View>
          </View>
        </View>
      </Card>

      {/* Rows */}
      <Card
        padding="xs"
        style={{
          marginBottom: spacing.lg,
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}
      >
        {rows.map((row, i) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: pressed ? colors.surfaceMuted : "transparent",
            })}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: row.destructive
                  ? colors.dangerMuted
                  : colors.primaryMuted,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name={row.icon}
                size={18}
                color={row.destructive ? colors.danger : colors.primary}
              />
            </View>
            <Text
              variant="body"
              style={{ flex: 1, fontWeight: "600" }}
              color={row.destructive ? "danger" : "text"}
            >
              {row.label}
            </Text>
            {row.right ?? (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textTertiary}
              />
            )}
          </Pressable>
        ))}
      </Card>

      <Text
        variant="caption"
        color="textTertiary"
        style={{ textAlign: "center" }}
      >
        BeSafe · v1.0.0 · Made for Lagos
      </Text>
    </Screen>
  );
}
