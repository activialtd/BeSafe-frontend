import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/Theme";
import { useAuth } from "@/contexts/authStore";
import { authService } from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

// Format the raw digit string as "0803 000 0000" while typing
function formatNg(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

function validate(digits: string): string | null {
  const d = digits.replace(/\D/g, "");
  if (d.length === 0) return null;
  if (d.length < 10) return "Number is too short";
  if (d.length > 11) return "Number is too long";
  // Nigerian mobile: after removing leading 0, first digit should be 7, 8 or 9
  const local = d.startsWith("0") ? d.slice(1) : d;
  if (!/^[789]/.test(local)) return "That doesn't look like a Nigerian number";
  return null;
}

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const setPendingPhone = useAuth((s) => s.setPendingPhone);

  const digits = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const isValid = validate(digits) === null && digits.length >= 10;

  const submit = async () => {
    setServerError(null);
    const local = digits.startsWith("0") ? digits.slice(1) : digits;
    const normalized = `+234${local}`;
    try {
      setLoading(true);
      await authService.requestOtp(normalized);
      setPendingPhone(normalized);
      router.push("/(onboarding)/otp");
    } catch (e: any) {
      setServerError(e.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Header />
      <Text variant="displaySm">What\u2019s your number?</Text>
      <Text
        variant="body"
        color="textSecondary"
        style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
      >
        We\u2019ll text you a 6-digit code to sign in.
      </Text>

      <Input
        label="Phone number"
        placeholder="0803 000 0000"
        keyboardType="phone-pad"
        maxLength={13}
        value={phone}
        onChangeText={(v) => setPhone(formatNg(v))}
        validate={(v) => validate(v)}
        error={serverError ?? undefined}
        leftAdornment={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text variant="body" style={{ fontWeight: "700" }}>
              🇳🇬
            </Text>
            <Text
              variant="body"
              color="textSecondary"
              style={{ marginLeft: 4, fontWeight: "600" }}
            >
              +234
            </Text>
          </View>
        }
        autoFocus
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: spacing.sm,
          marginBottom: spacing.xl,
          gap: 8,
        }}
      >
        <Ionicons
          name="information-circle-outline"
          size={16}
          color="#6B7280"
          style={{ marginTop: 2 }}
        />
        <Text variant="bodySm" color="textSecondary" style={{ flex: 1 }}>
          By continuing you agree to BeSafe\u2019s Terms.
        </Text>
      </View>

      <Button
        label="Send code"
        loading={loading}
        disabled={!isValid}
        onPress={submit}
      />
    </Screen>
  );
}
