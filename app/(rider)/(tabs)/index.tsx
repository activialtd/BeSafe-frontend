import { Card } from "@/components/ui/Card";
import { LogoMark } from "@/components/ui/Logo";
import { Text } from "@/components/ui/Text";
import { radius, shadow, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/authStore";
import { useRide } from "@/contexts/rideStore";
import {
  LAGOS_CENTER,
  mockNearbyDrivers,
  mockUnsafeZones,
} from "@/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mapStyleDark, mapStyleLight } from "./mapStyles";

export default function RiderHome() {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuth((s) => s.user);
  const activeSos = useRide((s) => s.activeSos);
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [showUnsafe, setShowUnsafe] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } catch {
        setLocation(LAGOS_CENTER);
      }
    })();
  }, []);

  const center = location ?? LAGOS_CENTER;
  const sosIsActive = activeSos?.status === "active";

  const openSos = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    router.push("/sos");
  };

  return (
    <View style={styles.root}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        customMapStyle={theme === "dark" ? mapStyleDark : mapStyleLight}
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {mockNearbyDrivers.map((d, i) => (
          <Marker
            key={d.id}
            coordinate={{
              latitude: center.lat + (i - 1) * 0.006,
              longitude: center.lng + (i - 1) * 0.008,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={[
                styles.carPin,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Ionicons name="car-sport" size={16} color={colors.primary} />
            </View>
          </Marker>
        ))}

        {showUnsafe &&
          mockUnsafeZones.map((z) => (
            <Circle
              key={z.id}
              center={{ latitude: z.center.lat, longitude: z.center.lng }}
              radius={z.radiusMeters}
              strokeColor={colors.danger}
              fillColor={
                z.severity === "high"
                  ? "rgba(239,68,68,0.20)"
                  : z.severity === "medium"
                    ? "rgba(245,158,11,0.18)"
                    : "rgba(245,158,11,0.10)"
              }
              strokeWidth={1}
            />
          ))}
      </MapView>

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <BlurView
          intensity={theme === "dark" ? 40 : 60}
          tint={theme === "dark" ? "dark" : "light"}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                theme === "dark"
                  ? "rgba(10,14,26,0.6)"
                  : "rgba(255,255,255,0.7)",
            },
          ]}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 12,
          }}
        >
          <LogoMark size={32} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text variant="caption" color="textSecondary">
              Hi,
            </Text>
            <Text variant="h4">{user?.fullName?.split(" ")[0] ?? "there"}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            hitSlop={12}
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Map controls */}
      <View style={[styles.mapControls, { top: insets.top + 100 }]}>
        <Pressable
          onPress={() => setShowUnsafe((v) => !v)}
          style={[
            styles.controlBtn,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name={showUnsafe ? "shield" : "shield-outline"}
            size={18}
            color={showUnsafe ? colors.danger : colors.textSecondary}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (location && mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: location.lat,
                  longitude: location.lng,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03,
                },
                400,
              );
            }
          }}
          style={[
            styles.controlBtn,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="locate" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* SOS ACTIVE bubble — floats above the sheet when SOS is running */}
      {sosIsActive && (
        <View style={[styles.sosBubbleWrap, { bottom: insets.bottom + 340 }]}>
          <Pressable onPress={() => router.push("/sos")}>
            <MotiView
              from={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              style={[
                styles.sosBubble,
                { backgroundColor: colors.danger },
                shadow.lg,
              ]}
            >
              <MotiView
                from={{ opacity: 0.6, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1.1 }}
                transition={{ loop: true, type: "timing", duration: 800 }}
                style={styles.sosBubbleDot}
              />
              <Text style={styles.sosBubbleText}>SOS active — tap to open</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </MotiView>
          </Pressable>
        </View>
      )}

      {/* Bottom sheet */}
      <MotiView
        from={{ translateY: 400 }}
        animate={{ translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surfaceElevated,
            paddingBottom: insets.bottom + 90,
            borderColor: colors.border,
          },
          shadow.xl,
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <Text variant="h3">Verify before you ride</Text>
        <Text
          variant="bodySm"
          color="textSecondary"
          style={{ marginTop: 4, marginBottom: spacing.lg }}
        >
          Scan the QR sticker inside the vehicle before you enter.
        </Text>

        {/* Two side-by-side CTAs: Scan QR + SOS */}
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {/* Scan QR */}
          <Pressable
            onPress={() => router.push("/(rider)/(tabs)/scan")}
            style={{ flex: 1 }}
          >
            <View
              style={{
                padding: spacing.base,
                borderRadius: radius.lg,
                backgroundColor: colors.primary,
                alignItems: "center",
              }}
            >
              <Ionicons name="qr-code" size={28} color="#fff" />
              <Text style={{ color: "#fff", marginTop: 8, fontWeight: "700" }}>
                Scan QR
              </Text>
            </View>
          </Pressable>

          {/* Panic / SOS */}
          <Pressable onPress={openSos} style={{ flex: 1 }}>
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: sosIsActive ? [1, 1.03, 1] : 1 }}
              transition={{ loop: sosIsActive, type: "timing", duration: 1200 }}
            >
              <View
                style={{
                  padding: spacing.base,
                  borderRadius: radius.lg,
                  backgroundColor: sosIsActive
                    ? colors.danger
                    : colors.dangerMuted,
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: colors.danger,
                }}
              >
                <Ionicons
                  name="warning"
                  size={28}
                  color={sosIsActive ? "#fff" : colors.danger}
                />
                <Text
                  style={{
                    marginTop: 8,
                    fontWeight: "700",
                    color: sosIsActive ? "#fff" : colors.danger,
                  }}
                >
                  {sosIsActive ? "SOS active" : "Panic / SOS"}
                </Text>
              </View>
            </MotiView>
          </Pressable>
        </View>

        {/* Nearby drivers count */}
        <View
          style={{
            marginTop: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.primary,
              marginRight: 6,
            }}
          />
          <Text variant="caption" color="textSecondary" style={{ flex: 1 }}>
            {mockNearbyDrivers.length} verified vehicles nearby
          </Text>
        </View>

        {/* Nearby drivers row */}
        <View style={{ flexDirection: "row", marginTop: spacing.sm, gap: 8 }}>
          {mockNearbyDrivers.slice(0, 3).map((d) => (
            <Card
              key={d.id}
              padding="sm"
              style={{ flex: 1, alignItems: "center" }}
              elevated={false}
              bordered
            >
              <Image
                source={{ uri: d.photoUrl }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
              <Text
                variant="caption"
                style={{ marginTop: 6, fontWeight: "700" }}
                numberOfLines={1}
              >
                {d.fullName.split(" ")[0]}
              </Text>
              <Text variant="caption" color="textTertiary">
                {d.distance}
              </Text>
            </Card>
          ))}
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  mapControls: { position: "absolute", right: 20, gap: 10 },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  sosBubbleWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "center",
  },
  sosBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 8,
  },
  sosBubbleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  sosBubbleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  carPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
