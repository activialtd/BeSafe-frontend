import { SOSButton } from "@/components/shared/SOSButton";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { radius, shadow, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useRide } from "@/contexts/rideStore";
import { ridesService } from "@/services/rides.service";
import { riderService } from "@/services/rider.service";
import { EmergencyContact } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mapStyleDark, mapStyleLight } from "@/constants/MapStyles";

const DEFAULT_LOC = { lat: 6.5244, lng: 3.3792 }; // Lagos fallback

export default function ActiveRide() {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const ride = useRide((s) => s.activeRide);
  const driver = useRide((s) => s.activeDriver);
  const vehicle = useRide((s) => s.activeVehicle);
  const setActiveRide = useRide((s) => s.setActiveRide);

  const mapRef = useRef<MapView>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number }>(DEFAULT_LOC);
  const [seconds, setSeconds] = useState(0);
  const [sharedWith, setSharedWith] = useState<string[]>(
    ride?.sharedWith ?? [],
  );
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [ending, setEnding] = useState(false);

  // Fetch real emergency contacts on mount
  useEffect(() => {
    riderService
      .getEmergencyContacts()
      .then(setContacts)
      .catch(() => {});
  }, []);

  // Duration timer
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Live location — start streaming when the screen mounts
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 3000,
          distanceInterval: 15,
        },
        (loc) => {
          const p = { lat: loc.coords.latitude, lng: loc.coords.longitude };
          setPos(p);
          if (ride) {
            ridesService.updateLocation(ride.id, {
              ...p,
              timestamp: new Date().toISOString(),
            });
          }
        },
      );
    })();
    return () => {
      sub?.remove();
    };
  }, [ride?.id]);

  if (!ride || !driver || !vehicle) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          padding: 24,
        }}
      >
        <Text variant="h3" align="center">
          No trip is being tracked
        </Text>
        <View style={{ marginTop: 16, alignSelf: "stretch" }}>
          <Button
            label="Back to home"
            onPress={() => router.replace("/(rider)/(tabs)")}
          />
        </View>
      </View>
    );
  }

  const toggleContact = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSharedWith((cur) => {
      const next = cur.includes(id)
        ? cur.filter((x) => x !== id)
        : [...cur, id];
      ridesService.setSharedWith(ride.id, next);
      return next;
    });
  };

  const arriveSafely = () => {
    Alert.alert(
      "Are you safely off?",
      "This stops sharing your live location with your contacts.",
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Yes, I'm safe",
          onPress: async () => {
            setEnding(true);
            try {
              await ridesService.end(ride.id);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              ).catch(() => {});
              setActiveRide(null); // clears driver/vehicle automatically in the updated store
              router.replace("/(rider)/(tabs)");
            } finally {
              setEnding(false);
            }
          },
        },
      ],
    );
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        customMapStyle={theme === "dark" ? mapStyleDark : mapStyleLight}
        initialRegion={{
          latitude: pos.lat,
          longitude: pos.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        region={{
          latitude: pos.lat,
          longitude: pos.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsCompass={false}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude: pos.lat, longitude: pos.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <MotiView
              from={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ loop: true, type: "timing", duration: 1600 }}
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primary,
              }}
            />
            <View style={[styles.livePin, { backgroundColor: colors.primary }]}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </View>
        </Marker>
      </MapView>

      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <BlurView
          intensity={40}
          tint={theme === "dark" ? "dark" : "light"}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                theme === "dark"
                  ? "rgba(10,14,26,0.7)"
                  : "rgba(255,255,255,0.85)",
            },
          ]}
        />
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <MotiView
                from={{ opacity: 0.4, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ loop: true, type: "timing", duration: 900 }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.success,
                }}
              />
              <Text
                variant="caption"
                style={{ fontWeight: "700", letterSpacing: 1 }}
                color="success"
              >
                LIVE · TRACKING YOU
              </Text>
            </View>
            <Text variant="h3" style={{ marginTop: 2 }}>
              {mm}:{ss}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.sosWrap, { bottom: insets.bottom + 360 }]}>
        <SOSButton size="compact" />
      </View>

      <MotiView
        from={{ translateY: 500 }}
        animate={{ translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surfaceElevated,
            paddingBottom: insets.bottom + 20,
            borderColor: colors.border,
          },
          shadow.xl,
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Real Driver Info */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {driver.photoUrl ? (
            <Image
              source={{ uri: driver.photoUrl }}
              style={{ width: 52, height: 52, borderRadius: 26 }}
            />
          ) : (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: colors.primaryMuted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="h4">{driver.fullName}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
                gap: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Ionicons name="star" size={12} color={colors.warning} />
                <Text variant="caption" style={{ fontWeight: "700" }}>
                  {driver.rating?.toFixed(1) || "5.0"}
                </Text>
              </View>
              <Text variant="caption" color="textTertiary">
                ·
              </Text>
              <Text variant="caption" color="textSecondary">
                {vehicle.brand} {vehicle.model} · {vehicle.color}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: spacing.base,
            paddingVertical: 10,
            borderRadius: radius.md,
            backgroundColor: colors.primaryMuted,
            alignItems: "center",
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: colors.primary,
          }}
        >
          <Text variant="h2" style={{ letterSpacing: 2 }}>
            {vehicle.plateNumber}
          </Text>
        </View>

        {/* Real Contacts */}
        <View style={{ marginTop: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.sm,
            }}
          >
            <Ionicons name="eye" size={14} color={colors.primary} />
            <Text
              variant="caption"
              color="textSecondary"
              style={{ marginLeft: 6, flex: 1, letterSpacing: 0.5 }}
            >
              {sharedWith.length === 0
                ? "TAP TO SHARE YOUR LIVE LOCATION"
                : `${sharedWith.length} ${sharedWith.length === 1 ? "person is" : "people are"} watching`}
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {contacts.map((c) => {
              const shared = sharedWith.includes(c.id);
              return (
                <Pressable key={c.id} onPress={() => toggleContact(c.id)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: radius.full,
                      backgroundColor: shared
                        ? colors.primary
                        : colors.surfaceMuted,
                      borderWidth: 1,
                      borderColor: shared ? colors.primary : colors.border,
                    }}
                  >
                    <Ionicons
                      name={shared ? "checkmark-circle" : "add-circle-outline"}
                      size={14}
                      color={shared ? "#fff" : colors.textSecondary}
                    />
                    <Text
                      variant="caption"
                      style={{
                        marginLeft: 6,
                        fontWeight: "600",
                        color: shared ? "#fff" : colors.text,
                      }}
                    >
                      {c.name.split(" ")[0]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="I've arrived safely"
            variant="secondary"
            onPress={arriveSafely}
            loading={ending}
            leftIcon={
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.primary}
              />
            }
          />
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  sosWrap: { position: "absolute", left: 20 },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingTop: 8,
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
  livePin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
