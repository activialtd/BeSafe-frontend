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

export default function DriverTrips() {
  const { colors } = useTheme();
  const [trips, setTrips] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ridesService.history().then((t) => {
      setTrips(t);
      setLoading(false);
    });
  }, []);

  // Simple calculation for "This Week" (trips in the last 7 days)
  const thisWeekCount = trips.filter(
    (t) =>
      new Date(t.startedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).length;

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={{ paddingTop: spacing.md, marginBottom: spacing.lg }}>
        <Text variant="displaySm">Verified trips</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: 4 }}>
          Rides where a passenger scanned your QR
        </Text>
      </View>

      {/* Summary */}
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          marginBottom: spacing.xl,
        }}
      >
        <Card padding="base" style={{ flex: 1 }}>
          <Text variant="caption" color="textSecondary">
            THIS WEEK
          </Text>
          <Text variant="h2" color="primary" style={{ marginTop: 4 }}>
            {thisWeekCount}
          </Text>
        </Card>
        <Card padding="base" style={{ flex: 1 }}>
          <Text variant="caption" color="textSecondary">
            TOTAL
          </Text>
          <Text variant="h2" style={{ marginTop: 4 }}>
            {trips.length}
          </Text>
        </Card>
      </View>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 80,
              borderRadius: 16,
              backgroundColor: colors.skeleton,
              marginBottom: spacing.md,
              opacity: 0.6,
            }}
          />
        ))
      ) : trips.length === 0 ? (
        <Card padding="xl" style={{ alignItems: "center" }}>
          <Ionicons name="car-outline" size={48} color={colors.textTertiary} />
          <Text variant="h4" style={{ marginTop: 12 }}>
            No trips yet
          </Text>
          <Text
            variant="bodySm"
            color="textSecondary"
            style={{ marginTop: 4, textAlign: "center" }}
          >
            When riders scan your QR code to verify your vehicle, the trips will
            appear here.
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
            <Card padding="base" style={{ marginBottom: spacing.md }}>
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
            </Card>
          </MotiView>
        ))
      )}
    </Screen>
  );
}
