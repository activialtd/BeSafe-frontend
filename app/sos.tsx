import { SOSButton } from "@/components/shared/SOSButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useRide } from "@/contexts/rideStore";
import { EMERGENCY_NUMBERS } from "@/services/endpoints";
import { riderService } from "@/services/rider.service";
import { sosService } from "@/services/sos.service";
import { EmergencyContact } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Stage = "idle" | "triggering" | "active" | "cancelling";
const FALLBACK_LOC = { lat: 6.5244, lng: 3.3792 }; // Lagos fallback

export default function SosScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const activeRide = useRide((s) => s.activeRide);
  const setActiveSos = useRide((s) => s.setActiveSos);

  const [stage, setStage] = useState<Stage>("idle");
  const [sosId, setSosId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const vibRef = useRef(false);

  // Fetch real emergency contacts for the UI
  useEffect(() => {
    riderService
      .getEmergencyContacts()
      .then(setContacts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      Vibration.cancel();
    };
  }, []);

  const trigger = async () => {
    setStage("triggering");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {},
    );
    Vibration.vibrate([0, 500, 300, 500, 300, 500], true);
    vibRef.current = true;

    try {
      const event = await sosService.trigger({
        location: activeRide?.currentLocation ?? FALLBACK_LOC,
        rideId: activeRide?.id,
        type: "panic",
      });
      setSosId(event.id);
      setActiveSos(event);
      setStage("active");
    } catch {
      setStage("idle");
      Vibration.cancel();
      vibRef.current = false;
    }
  };

  const callEmergency = (label: string, number: string) => {
    Alert.alert(`Call ${label}?`, number, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL(`tel:${number}`) },
    ]);
  };

  const cancelSos = async () => {
    if (!sosId) return;
    setPinError(null);
    setStage("cancelling");
    try {
      await sosService.cancel(sosId, pin);
      Vibration.cancel();
      vibRef.current = false;
      setActiveSos(null);
      router.back();
    } catch (e: any) {
      setPinError(e.message ?? "Wrong PIN");
      setStage("active");
    }
  };

  // ── IDLE (pre-trigger) ─────────────────────────────────────────
  if (stage === "idle" || stage === "triggering") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[colors.dangerMuted, colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: spacing.lg }}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <Text variant="displaySm" color="danger">
            Emergency
          </Text>
          <Text variant="body" color="textSecondary" style={{ marginTop: 6 }}>
            Hold the SOS button to alert authorities and your emergency
            contacts. Your location will be shared instantly.
          </Text>

          <View
            style={{ alignItems: "center", marginVertical: spacing["3xl"] }}
          >
            <SOSButton size="full" onTrigger={trigger} requireHold />
            <Text
              variant="caption"
              color="textSecondary"
              style={{ marginTop: 24, letterSpacing: 1 }}
            >
              HOLD FOR 1.2 SECONDS
            </Text>
          </View>

          <Text variant="h4" style={{ marginBottom: 12 }}>
            Or call directly
          </Text>
          {[
            {
              label: "Emergency (Police / Fire / Ambulance)",
              number: EMERGENCY_NUMBERS.police,
              icon: "call" as const,
            },
            {
              label: "Rapid Response Squad (Lagos)",
              number: EMERGENCY_NUMBERS.rrs,
              icon: "shield" as const,
            },
          ].map((row) => (
            <Pressable
              key={row.number}
              onPress={() => callEmergency(row.label, row.number)}
            >
              <Card
                padding="base"
                style={{
                  marginBottom: spacing.sm,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.dangerMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={row.icon} size={20} color={colors.danger} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text variant="body" style={{ fontWeight: "600" }}>
                    {row.label}
                  </Text>
                  <Text variant="bodySm" color="textSecondary">
                    {row.number}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textTertiary}
                />
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ── ACTIVE (post-trigger) ──────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: colors.danger }}>
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, type: "timing", duration: 700 }}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={["#7F1D1D", colors.danger, "#7F1D1D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </MotiView>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1.12 }}
            transition={{ loop: true, type: "timing", duration: 900 }}
          >
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.4)",
              }}
            >
              <Ionicons name="warning" size={48} color="#fff" />
            </View>
          </MotiView>

          <Text
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: "800",
              marginTop: spacing.xl,
              letterSpacing: -0.5,
              textAlign: "center",
            }}
          >
            SOS ACTIVE
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginTop: spacing.sm,
              fontSize: 15,
              lineHeight: 21,
              paddingHorizontal: spacing.md,
            }}
          >
            Help is on the way. Stay calm.{"\n"}Do not turn off your phone.
          </Text>
        </View>

        <Text
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            letterSpacing: 1,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          NOTIFIED
        </Text>
        {[
          {
            icon: "shield" as const,
            label: "Nigerian Police Force (112)",
            sub: "Dispatch alerted",
          },
          { icon: "medkit" as const, label: "LASEMA", sub: "On standby" },
          {
            icon: "car" as const,
            label: "Rapid Response Squad",
            sub: "Nearest unit dispatched",
          },
        ].map((n) => (
          <View
            key={n.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              marginBottom: 8,
              borderRadius: radius.md,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={n.icon} size={18} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {n.label}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {n.sub}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </View>
        ))}

        <Text
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 12,
            letterSpacing: 1,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: spacing.base,
          }}
        >
          EMERGENCY CONTACTS
        </Text>
        {contacts.map((c) => (
          <View
            key={c.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              marginBottom: 8,
              borderRadius: radius.md,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {c.name[0]?.toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>{c.name}</Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {c.phone}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                NOTIFIED
              </Text>
            </View>
          </View>
        ))}
        {contacts.length === 0 && (
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
              paddingLeft: 4,
            }}
          >
            No emergency contacts set.
          </Text>
        )}

        <View
          style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            borderRadius: radius.xl,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", marginBottom: 4 }}>
            False alarm?
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 13,
              marginBottom: 12,
              lineHeight: 18,
            }}
          >
            Enter your 4-digit safety PIN to cancel.
          </Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="• • • •"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: radius.md,
              padding: 14,
              color: "#fff",
              fontSize: 20,
              fontWeight: "700",
              letterSpacing: 8,
              textAlign: "center",
              marginBottom: 12,
            }}
          />
          {pinError ? (
            <Text style={{ color: "#FEE2E2", marginBottom: 8, fontSize: 13 }}>
              {pinError}
            </Text>
          ) : null}
          <Button
            label="Cancel SOS"
            variant="secondary"
            onPress={cancelSos}
            disabled={pin.length !== 4 || stage === "cancelling"}
            loading={stage === "cancelling"}
          />
        </View>
      </ScrollView>
    </View>
  );
}
