import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/authStore";
import { authService } from "@/services/auth.service";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

const LEN = 6;

export default function OtpScreen() {
  const { colors } = useTheme();
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(30);
  const refs = useRef<(TextInput | null)[]>([]);
  const phone = useAuth((s) => s.pendingPhone);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const onChange = (i: number, v: string) => {
    if (v.length > 1) {
      // paste handling
      const clean = v.replace(/\D/g, "").slice(0, LEN);
      const arr = clean.split("").concat(Array(LEN - clean.length).fill(""));
      setDigits(arr);
      refs.current[Math.min(clean.length, LEN - 1)]?.focus();
      return;
    }
    const next = [...digits];
    next[i] = v.replace(/\D/g, "");
    setDigits(next);
    if (v && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, key: string) => {
    if (key === "Backspace" && !digits[i] && i > 0)
      refs.current[i - 1]?.focus();
  };

  const code = digits.join("");
  const canSubmit = code.length === LEN;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      setLoading(true);
      await authService.verifyOtp(phone ?? "", code);
      router.push("/(onboarding)/nin");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || !phone) return;
    setError(null);
    try {
      await authService.requestOtp(phone);
      setCooldown(30);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Screen scroll>
      <Header />
      <Text variant="displaySm">Verify your phone</Text>
      <Text
        variant="body"
        color="textSecondary"
        style={{ marginTop: spacing.sm }}
      >
        Enter the 6-digit code sent to{" "}
        <Text variant="body" style={{ fontWeight: "700" }}>
          {phone ?? ""}
        </Text>
      </Text>
      <Text variant="caption" color="textTertiary" style={{ marginTop: 4 }}>
        Demo tip: enter{" "}
        <Text variant="caption" color="primary">
          000000
        </Text>
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: spacing["2xl"],
          marginBottom: spacing.base,
        }}
      >
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              refs.current[i] = r;
            }}
            value={d}
            onChangeText={(v) => onChange(i, v)}
            onKeyPress={(e) => onKey(i, e.nativeEvent.key)}
            keyboardType="number-pad"
            maxLength={LEN}
            style={[
              styles.box,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: d ? colors.primary : colors.border,
                color: colors.text,
              },
            ]}
          />
        ))}
      </View>

      {error ? (
        <Text
          variant="bodySm"
          color="danger"
          style={{ marginBottom: spacing.md }}
        >
          {error}
        </Text>
      ) : null}

      <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
        {cooldown > 0 ? (
          <Text variant="bodySm" color="textSecondary">
            Resend code in {cooldown}s
          </Text>
        ) : (
          <Text
            variant="bodySm"
            color="primary"
            style={{ fontWeight: "700" }}
            onPress={resend}
          >
            Resend code
          </Text>
        )}
      </View>

      <Button
        label="Verify"
        onPress={submit}
        loading={loading}
        disabled={!canSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 48,
    height: 60,
    borderRadius: radius.md,
    borderWidth: 2,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
});
