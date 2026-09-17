import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { ridesService } from "@/services/rides.service";
import { Ride } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

function formatDuration(startedAt: string, endedAt?: string): string {
  if (!endedAt) return "—";
  const mins = Math.round(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000,
  );
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function TripsScreen() {
  const { colors } = useTheme();
  const [trips, setTrips] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ridesService.history().then((t) => {
      setTrips(t);
      console.log(t, "the trips");
      setLoading(false);
    });
  }, []);

  console.log(trips, "the tripppssss");

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={{ paddingTop: spacing.md, marginBottom: spacing.lg }}>
        <Text variant="displaySm">Your trips</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: 4 }}>
          Every ride you've verified through BeSafe
        </Text>
      </View>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 100,
              borderRadius: 20,
              backgroundColor: colors.skeleton,
              marginBottom: spacing.md,
              opacity: 0.6,
            }}
          />
        ))
      ) : trips.length === 0 ? (
        <Card padding="xl" style={{ alignItems: "center" }}>
          <Ionicons name="time-outline" size={48} color={colors.textTertiary} />
          <Text variant="h4" style={{ marginTop: 12 }}>
            No trips yet
          </Text>
          <Text
            variant="bodySm"
            color="textSecondary"
            style={{ marginTop: 4, textAlign: "center" }}
          >
            Verified rides will appear here
          </Text>
        </Card>
      ) : (
        trips.map((t, i) => (
          <MotiView
            key={t.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            delay={i * 80}
          >
            <Card style={{ marginBottom: spacing.md }} padding="base">
              {/* Top row: date + verified badge */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.successMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="checkmark" size={20} color={colors.success} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text variant="body" style={{ fontWeight: "600" }}>
                    {new Date(t.startedAt).toLocaleDateString("en-NG", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <Text variant="bodySm" color="textSecondary">
                    {new Date(t.startedAt).toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {formatDuration(t.startedAt, t.endedAt)}
                  </Text>
                </View>
                <Badge tone="success" size="sm" label="Verified" />
              </View>

              {/* Driver / vehicle row (Rendered natively from backend data) */}
              {/* @ts-ignore - Assuming you haven't added driver/vehicle to the Ride interface yet */}
              {(t.driver || t.vehicle) && (
                <View
                  style={{
                    marginTop: spacing.md,
                    paddingTop: spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="person"
                    size={14}
                    color={colors.textTertiary}
                  />
                  <Text
                    variant="caption"
                    color="textSecondary"
                    style={{ marginLeft: 4, flex: 1 }}
                  >
                    {t.driver?.fullName ?? "Driver"}
                  </Text>

                  {t.vehicle && (
                    <>
                      <Ionicons
                        name="car"
                        size={14}
                        color={colors.textTertiary}
                        style={{ marginRight: 4 }}
                      />
                      <Text variant="caption" style={{ fontWeight: "600" }}>
                        {t.vehicle.plateNumber}
                      </Text>
                    </>
                  )}
                </View>
              )}

              {/* Status info if ride is currently active */}
              {t.status === "active" && (
                <View
                  style={{
                    marginTop: spacing.md,
                    paddingTop: spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="radio-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text
                    variant="caption"
                    style={{
                      marginLeft: 4,
                      flex: 1,
                      color: colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    Currently tracking
                  </Text>
                </View>
              )}

              {/* Sharing count */}
              {(t.sharedWith?.length ?? 0) > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Ionicons
                    name="eye-outline"
                    size={12}
                    color={colors.textTertiary}
                  />
                  <Text
                    variant="caption"
                    color="textTertiary"
                    style={{ marginLeft: 4 }}
                  >
                    Shared with {t.sharedWith.length}{" "}
                    {t.sharedWith.length === 1 ? "contact" : "contacts"}
                  </Text>
                </View>
              )}
            </Card>
          </MotiView>
        ))
      )}
    </Screen>
  );
}
