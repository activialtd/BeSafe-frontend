import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/authStore";
import { driverService } from "@/services/driver.service";
import { Driver, Vehicle } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Pressable, Switch, View } from "react-native";

export default function DriverDashboard() {
  const { colors } = useTheme();
  const user = useAuth((s) => s.user);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    driverService.getProfile().then((d) => {
      setDriver(d);
      setOnline(d.isOnline);
    });
  }, []);

  const toggleOnline = async (v: boolean) => {
    setOnline(v);
    await driverService.setOnline(v);
  };

  const vehicles: Vehicle[] = driver?.vehicles ?? [];

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: 120 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="bodySm" color="textSecondary">
            Hi,
          </Text>
          <Text variant="h2">{user?.fullName?.split(" ")[0] ?? "Driver"}</Text>
        </View>
        <Pressable
          onPress={() => router.push("/settings")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="settings" size={20} color={colors.text} />
        </Pressable>
      </View>

      {/* On-duty / off-duty */}
      <MotiView
        from={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <LinearGradient
          colors={
            online
              ? [colors.primary, colors.primaryDark ?? colors.primary]
              : [colors.surface, colors.surface]
          }
          style={{
            borderRadius: radius.xl,
            padding: spacing.lg,
            borderWidth: online ? 0 : 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: online ? "#fff" : colors.textTertiary,
                  }}
                />
                <Text
                  variant="caption"
                  style={{
                    color: online
                      ? "rgba(255,255,255,0.85)"
                      : colors.textSecondary,
                    fontWeight: "700",
                    letterSpacing: 1,
                  }}
                >
                  {online ? "ON DUTY" : "OFF DUTY"}
                </Text>
              </View>
              <Text
                variant="h3"
                style={{ color: online ? "#fff" : colors.text }}
              >
                {online
                  ? "You\u2019re visible to riders"
                  : "Go on duty to be visible"}
              </Text>
              <Text
                variant="bodySm"
                style={{
                  color: online
                    ? "rgba(255,255,255,0.85)"
                    : colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {online
                  ? "Riders nearby can see and verify your vehicle."
                  : "Toggle on when you\u2019re working today."}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={toggleOnline}
              trackColor={{ true: "rgba(255,255,255,0.3)" }}
              thumbColor={online ? "#fff" : colors.surfaceMuted}
            />
          </View>
        </LinearGradient>
      </MotiView>

      {/* Stats — trust-focused, no earnings */}
      <View
        style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}
      >
        <StatCard
          label="Verified trips"
          value={String(driver?.totalTrips ?? 0)}
          icon="checkmark-done"
          tint={colors.primary}
        />
        <StatCard
          label="Rating"
          value={driver?.rating.toFixed(1) ?? "—"}
          icon="star"
          tint={colors.warning}
        />
        <StatCard
          label="Status"
          value={online ? "Live" : "Off"}
          icon="pulse"
          tint={online ? colors.success : colors.textTertiary}
        />
      </View>

      {/* Vehicles */}
      <View
        style={{
          marginTop: spacing.xl,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text variant="h3" style={{ flex: 1 }}>
          Your vehicles
        </Text>
        <Pressable
          onPress={() => router.push("/(driver)/register-vehicle")}
          hitSlop={8}
        >
          <Text variant="bodySm" color="primary" style={{ fontWeight: "700" }}>
            + Add
          </Text>
        </Pressable>
      </View>

      <View style={{ marginTop: spacing.md, gap: spacing.md }}>
        {vehicles.map((v) => (
          <Card key={v.id} padding="base">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.primaryMuted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="car-sport" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text variant="body" style={{ fontWeight: "700" }}>
                  {v.brand} {v.model}
                </Text>
                <Text variant="bodySm" color="textSecondary">
                  {v.color} · {v.year} · {v.plateNumber}
                </Text>
              </View>
              <Badge tone="success" size="sm" label="Verified" />
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                marginTop: spacing.md,
              }}
            >
              <View style={{ flex: 1 }}>
                <Button
                  label="Show QR"
                  variant="outline"
                  size="sm"
                  leftIcon={
                    <Ionicons name="qr-code" size={16} color={colors.primary} />
                  }
                  onPress={() =>
                    router.push({
                      pathname: "/(driver)/qr-code",
                      params: { vehicleId: v.id },
                    })
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  label="Manage"
                  variant="ghost"
                  size="sm"
                  onPress={() => {}}
                />
              </View>
            </View>
          </Card>
        ))}

        {vehicles.length === 0 && (
          <Card padding="lg" style={{ alignItems: "center" }}>
            <Ionicons
              name="car-outline"
              size={40}
              color={colors.textTertiary}
            />
            <Text variant="h4" style={{ marginTop: 8 }}>
              No vehicles yet
            </Text>
            <Text
              variant="bodySm"
              color="textSecondary"
              style={{ marginTop: 4, marginBottom: 16, textAlign: "center" }}
            >
              Register your first vehicle to get a QR sticker.
            </Text>
            <Button
              label="Register vehicle"
              onPress={() => router.push("/(driver)/register-vehicle")}
              full={false}
            />
          </Card>
        )}
      </View>

      {/* Trust tip */}
      <Card
        padding="lg"
        style={{
          marginTop: spacing.xl,
          backgroundColor: colors.primaryMuted,
          borderColor: colors.primary,
          borderWidth: 1,
        }}
        elevated={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
          <Text variant="h4" style={{ marginLeft: 8 }}>
            Riders trust the sticker
          </Text>
        </View>
        <Text variant="bodySm" color="textSecondary" style={{ lineHeight: 20 }}>
          Print your QR, laminate it, and stick it where every passenger can
          see. The more scans, the more your rating builds.
        </Text>
      </Card>
    </Screen>
  );
}

function StatCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
}) {
  return (
    <Card padding="base" style={{ flex: 1 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: tint + "20",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Ionicons name={icon} size={16} color={tint} />
      </View>
      <Text variant="h3">{value}</Text>
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </Card>
  );
}
