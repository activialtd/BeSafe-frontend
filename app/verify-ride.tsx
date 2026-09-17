import { DriverCard } from "@/components/shared/DriverCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useRide } from "@/contexts/rideStore";
import { ridesService } from "@/services/rides.service";
import {
  RideVerificationResult,
  verifyService,
} from "@/services/verify.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function VerifyRide() {
  const { colors } = useTheme();
  const setActiveRide = useRide((s) => s.setActiveRide);
  const { mode, token } = useLocalSearchParams<{
    mode?: string;
    token?: string;
  }>();

  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [result, setResult] = useState<RideVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyQr = async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await verifyService.byQr(t);
      setResult(r);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPlate = async () => {
    if (plate.replace(/\s/g, "").length < 5) {
      setError("Enter a valid plate number");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await verifyService.byPlate(plate);
      setResult(r);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "qr" && token) verifyQr(token);
  }, [mode, token]);

  const startTracking = async () => {
    if (!result?.ok || !result.vehicle || !result.driver) return;
    setStarting(true);
    try {
      const ride = await ridesService.start(result.vehicle.id);

      setActiveRide(ride, result.driver, result.vehicle);
      router.replace("/active-ride");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setStarting(false);
    }
  };

  return (
    <Screen scroll>
      <Header title={mode === "qr" ? "Verifying" : "Enter plate number"} />

      {mode === "plate" && !result && (
        <>
          <Text
            variant="body"
            color="textSecondary"
            style={{ marginBottom: spacing.lg }}
          >
            Type the plate as shown on the back of the vehicle.
          </Text>
          <Input
            label="Plate number"
            placeholder="LAG-482-XA"
            value={plate}
            onChangeText={(v) => setPlate(v.toUpperCase())}
            autoCapitalize="characters"
            error={error ?? undefined}
            leftAdornment={
              <Ionicons name="car" size={20} color={colors.textSecondary} />
            }
          />
          <View style={{ marginTop: spacing.base }}>
            <Button
              label="Verify vehicle"
              loading={loading}
              onPress={verifyPlate}
            />
          </View>
        </>
      )}

      {loading && mode === "qr" && (
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ loop: true, type: "timing", duration: 1000 }}
          >
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.primaryMuted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={48}
                color={colors.primary}
              />
            </View>
          </MotiView>
          <Text variant="h3" style={{ marginTop: 24 }}>
            Checking...
          </Text>
          <Text
            variant="bodySm"
            color="textSecondary"
            style={{ marginTop: 6, textAlign: "center" }}
          >
            Looking this vehicle up in the BeSafe registry
          </Text>
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        </View>
      )}

      {result && (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400 }}
        >
          {result.ok ? (
            <>
              <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <View
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 44,
                      backgroundColor: colors.successMuted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="checkmark"
                      size={52}
                      color={colors.success}
                    />
                  </View>
                </MotiView>
                <Text variant="h2" style={{ marginTop: 16 }}>
                  Verified
                </Text>
                <Text
                  variant="body"
                  color="textSecondary"
                  style={{ marginTop: 4, textAlign: "center" }}
                >
                  This vehicle is registered on BeSafe.
                </Text>
              </View>

              <DriverCard driver={result.driver!} vehicle={result.vehicle!} />

              {result.warnings && result.warnings.length > 0 && (
                <Card
                  padding="md"
                  style={{
                    marginTop: spacing.base,
                    borderColor: colors.warning,
                    borderWidth: 1,
                    flexDirection: "row",
                    backgroundColor: colors.warningMuted,
                  }}
                  elevated={false}
                >
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color={colors.warning}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    {result.warnings.map((w) => (
                      <Text key={w} variant="bodySm" color="text">
                        {w}
                      </Text>
                    ))}
                  </View>
                </Card>
              )}

              <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
                <Button
                  label="I'm getting in — start tracking"
                  onPress={startTracking}
                  loading={starting}
                />
                <Button
                  label="Cancel"
                  variant="ghost"
                  onPress={() => router.back()}
                />
              </View>
            </>
          ) : (
            <View style={{ alignItems: "center", marginTop: spacing.xl }}>
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <View
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: colors.dangerMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="close" size={52} color={colors.danger} />
                </View>
              </MotiView>
              <Text
                variant="h2"
                style={{ marginTop: 16, color: colors.danger }}
              >
                Not verified
              </Text>
              <Text
                variant="body"
                color="textSecondary"
                style={{ marginTop: 8, textAlign: "center" }}
              >
                This vehicle isn't in the BeSafe registry.{"\n"}
                <Text variant="body" style={{ fontWeight: "700" }}>
                  Don't enter.
                </Text>
              </Text>

              <Card
                padding="base"
                style={{
                  marginTop: spacing.xl,
                  flexDirection: "row",
                  borderColor: colors.danger,
                  borderWidth: 1,
                  backgroundColor: colors.dangerMuted,
                }}
                elevated={false}
              >
                <Ionicons
                  name="warning"
                  size={20}
                  color={colors.danger}
                  style={{ marginRight: 10 }}
                />
                <Text variant="bodySm" style={{ flex: 1 }}>
                  If you feel unsafe, walk away calmly and report this vehicle.
                </Text>
              </Card>

              <View
                style={{ marginTop: spacing.xl, gap: 12, alignSelf: "stretch" }}
              >
                <Button
                  label="Report this vehicle"
                  variant="danger"
                  onPress={() => {}}
                />
                <Button
                  label="Try again"
                  variant="outline"
                  onPress={() => {
                    setResult(null);
                    setPlate("");
                    setError(null);
                  }}
                />
              </View>
            </View>
          )}
        </MotiView>
      )}
    </Screen>
  );
}
