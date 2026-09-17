import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { LogoMark } from "@/components/ui/Logo";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { driverService } from "@/services/driver.service";
import { Vehicle } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";

export default function QrCodeScreen() {
  const { colors } = useTheme();
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const cardRef = useRef<View>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    driverService.getProfile().then((d) => {
      const found = d.vehicles.find((v) => v.id === vehicleId);
      if (found) setVehicle(found);
    });
  }, [vehicleId]);

  // Construct the payload exactly as the verify endpoint expects it
  const payload = vehicle ? JSON.stringify({ token: vehicle.qrToken }) : "";

  const capture = async () => {
    if (!cardRef.current) return null;
    return captureRef(cardRef, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
  };

  const download = async () => {
    setBusy(true);
    try {
      const uri = await capture();
      if (!uri) return;
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission needed",
          "Enable photo library access to save your QR code.",
        );
        return;
      }
      await MediaLibrary.saveToLibraryAsync(uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      Alert.alert(
        "Saved",
        "Your QR code has been saved to your photos. Print it and display it clearly inside your vehicle.",
      );
    } catch (e: any) {
      Alert.alert("Could not save", e.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    try {
      const uri = await capture();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { dialogTitle: "My BeSafe QR code" });
      }
    } catch (e: any) {
      Alert.alert("Could not share", e.message ?? "Please try again.");
    }
  };

  if (!vehicle)
    return (
      <Screen scroll>
        <Header onBack={() => router.replace("/(driver)/(tabs)")} />
      </Screen>
    );

  return (
    <Screen scroll>
      <Header
        title="Your BeSafe QR code"
        subtitle="Print and display this inside your vehicle"
        onBack={() => router.replace("/(driver)/(tabs)")}
      />

      <View
        ref={cardRef}
        collapsable={false}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: radius.xl,
          padding: 24,
          alignItems: "center",
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <LogoMark size={26} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 20,
              fontWeight: "800",
              color: "#0B1220",
            }}
          >
            BeSafe
          </Text>
        </View>

        <Text
          style={{
            color: "#0B1220",
            fontSize: 13,
            fontWeight: "600",
            letterSpacing: 1.2,
            marginBottom: 14,
          }}
        >
          VERIFY BEFORE YOU RIDE
        </Text>

        <View
          style={{
            padding: 12,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#00A86B",
          }}
        >
          <QRCode
            value={payload}
            size={220}
            backgroundColor="#FFFFFF"
            color="#0B1220"
            ecl="H"
          />
        </View>

        <View
          style={{
            marginTop: 18,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "#0B1220",
          }}
        >
          <Text
            style={{
              color: "#0B1220",
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: 2,
            }}
          >
            {vehicle.plateNumber}
          </Text>
        </View>

        <Text
          style={{
            color: "#4B5563",
            fontSize: 13,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          {vehicle.brand} {vehicle.model} · {vehicle.color}
        </Text>
        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 10,
            marginTop: 10,
            letterSpacing: 1,
          }}
        >
          LAGOS · besafe.ng
        </Text>
      </View>

      <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
        <Button
          label="Download to photos"
          leftIcon={<Ionicons name="download" size={18} color="#fff" />}
          onPress={download}
          loading={busy}
        />
        <Button
          label="Share"
          variant="outline"
          leftIcon={
            <Ionicons name="share-social" size={18} color={colors.primary} />
          }
          onPress={share}
        />
      </View>

      <Card
        padding="lg"
        style={{
          backgroundColor: colors.warningMuted,
          borderColor: colors.warning,
          borderWidth: 1,
        }}
        elevated={false}
      >
        <Text variant="h4" style={{ marginBottom: 8 }}>
          How to display it
        </Text>
        <Tip text="Print in colour on A4 paper at 100% scale." />
        <Tip text="Laminate to protect from rain and wear." />
        <Tip text="Mount on the passenger-side dashboard or headrest." />
        <Tip text="Make sure the whole code is visible and not folded." last />
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        <Button
          label="Go to dashboard"
          variant="secondary"
          onPress={() => router.replace("/(driver)/(tabs)")}
        />
      </View>
    </Screen>
  );
}

function Tip({ text, last }: { text: string; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", marginBottom: last ? 0 : 8 }}>
      <Ionicons
        name="checkmark-circle"
        size={18}
        color={colors.warning}
        style={{ marginRight: 8, marginTop: 1 }}
      />
      <Text variant="bodySm" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}
