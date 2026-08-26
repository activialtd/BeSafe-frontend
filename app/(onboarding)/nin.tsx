import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/authStore";
import { authService } from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import { View } from "react-native";

function validateNin(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (d.length === 0) return null;
  if (d.length < 11) return `${d.length}/11 digits`;
  if (d.length > 11) return "NIN is 11 digits";
  return null;
}

export default function NinScreen() {
  const { colors } = useTheme();
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<null | { fullName: string }>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const setPendingNin = useAuth((s) => s.setPendingNin);
  const finish = useAuth((s) => s.finishOnboarding);
  const pendingRole = useAuth((s) => s.pendingRole);

  const isDriver = pendingRole === "driver";

  const verify = async () => {
    setServerError(null);
    try {
      setLoading(true);
      const res = await authService.verifyNin(nin);
      setVerified({ fullName: res.fullName });
      setPendingNin(nin);
    } catch (e: any) {
      setServerError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const proceed = async () => {
    setLoading(true);
    try {
      const user = await finish();
      if (user.role === "driver") router.replace("/(driver)/register-vehicle");
      else router.replace("/(onboarding)/emergency-contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Header />
      <Text variant="displaySm">Add your NIN</Text>
      <Text
        variant="body"
        color="textSecondary"
        style={{
          marginTop: spacing.sm,
          marginBottom: spacing.xl,
          lineHeight: 22,
        }}
      >
        {isDriver
          ? "This is how riders know you\u2019re a real, verified driver — not just someone who painted a car yellow."
          : "One quick check so we know you\u2019re real. Drivers never see your NIN."}
      </Text>

      {!verified ? (
        <>
          <Input
            label="National Identification Number"
            placeholder="12345678901"
            keyboardType="number-pad"
            maxLength={11}
            value={nin}
            onChangeText={(v) => setNin(v.replace(/\D/g, ""))}
            validate={validateNin}
            error={serverError ?? undefined}
            leftAdornment={
              <Ionicons
                name="id-card-outline"
                size={20}
                color={colors.textSecondary}
              />
            }
          />

          <Card
            padding="md"
            style={{
              marginTop: spacing.sm,
              marginBottom: spacing.xl,
              flexDirection: "row",
              backgroundColor: colors.primaryMuted,
              borderColor: colors.primary,
              borderWidth: 1,
            }}
            elevated={false}
          >
            <Ionicons
              name="lock-closed"
              size={18}
              color={colors.primary}
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text
              variant="bodySm"
              color="textSecondary"
              style={{ flex: 1, lineHeight: 19 }}
            >
              Verified against NIMC. Stored encrypted. Never shared.
            </Text>
          </Card>

          <Button
            label="Verify"
            loading={loading}
            disabled={nin.length !== 11}
            onPress={verify}
          />
        </>
      ) : (
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <Card padding="lg" style={{ alignItems: "center" }}>
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.successMuted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={48}
                  color={colors.success}
                />
              </View>
            </MotiView>
            <Text variant="h2" style={{ marginTop: spacing.base }}>
              You\u2019re in
            </Text>
            <Text
              variant="body"
              color="textSecondary"
              style={{ marginTop: 4, textAlign: "center", lineHeight: 22 }}
            >
              Welcome, {verified.fullName.split(" ")[0]}.
            </Text>
          </Card>

          <View style={{ marginTop: spacing["2xl"] }}>
            <Button label="Continue" onPress={proceed} loading={loading} />
          </View>
        </MotiView>
      )}
    </Screen>
  );
}
