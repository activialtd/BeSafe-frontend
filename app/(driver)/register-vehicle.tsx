import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { driverService } from "@/services/driver.service";
import { VehicleType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

const VEHICLE_TYPES: {
  id: VehicleType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  hint: string;
}[] = [
  { id: "car", label: "Car", icon: "car-sport", hint: "Sedan or hatchback" },
  { id: "bus", label: "Bus (Danfo)", icon: "bus", hint: "14-seater and up" },
  { id: "minivan", label: "Minivan", icon: "car", hint: "Korope / Coaster" },
  { id: "tricycle", label: "Keke", icon: "bicycle", hint: "Tricycle (Napep)" },
  { id: "motorcycle", label: "Okada", icon: "bicycle", hint: "Motorcycle" },
];

export default function RegisterVehicle() {
  const { colors } = useTheme();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [type, setType] = useState<VehicleType | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");

  // New States for Plate Verification
  const [plateVerified, setPlateVerified] = useState(false);
  const [verifyingPlate, setVerifyingPlate] = useState(false);
  const [plateError, setPlateError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  // Require plate verification to proceed
  const step2Valid = useMemo(
    () =>
      plateVerified &&
      brand.length >= 2 &&
      model.length >= 1 &&
      year.length === 4 &&
      color.length >= 3,
    [brand, model, year, color, plateVerified],
  );

  const handleVerifyPlate = async () => {
    if (plate.replace(/\s/g, "").length < 5) {
      setPlateError("Enter a valid plate number");
      return;
    }

    setPlateError(null);
    setVerifyingPlate(true);

    try {
      const res = await driverService.verifyPlate(plate);

      // Auto-fill details from the government registry!
      if (res?.details) {
        if (res.details.make) setBrand(res.details.make);
        if (res.details.model) setModel(res.details.model);
        if (res.details.year) setYear(String(res.details.year));
        if (res.details.color) setColor(res.details.color);
      }

      setPlateVerified(true);
    } catch (e: any) {
      setPlateError(e.message || "Failed to verify plate. Try again.");
      setPlateVerified(false);
    } finally {
      setVerifyingPlate(false);
    }
  };

  const submit = async () => {
    if (!type || !step2Valid) return;
    setSaving(true);
    try {
      const v = await driverService.registerVehicle({
        type,
        brand,
        model,
        year: Number(year),
        color,
        plateNumber: plate.toUpperCase(),
      });
      router.replace({
        pathname: "/(driver)/qr-code",
        params: { vehicleId: v.id },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll>
      <Header
        title="Register your vehicle"
        subtitle={`Step ${step} of 3`}
        onBack={step > 1 ? () => setStep((s) => (s - 1) as any) : undefined}
      />

      {/* Progress bar */}
      <View style={{ flexDirection: "row", gap: 6, marginBottom: spacing.xl }}>
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: n <= step ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

      {step === 1 && (
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <Text variant="h3" style={{ marginBottom: 8 }}>
            What kind of vehicle?
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ marginBottom: spacing.lg }}
          >
            This helps riders know what to look for.
          </Text>

          <View style={{ gap: 10 }}>
            {VEHICLE_TYPES.map((v) => {
              const active = type === v.id;
              return (
                <Pressable key={v.id} onPress={() => setType(v.id)}>
                  <Card
                    padding="base"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: active ? colors.primary : colors.border,
                      backgroundColor: active
                        ? colors.primaryMuted
                        : colors.surface,
                    }}
                    elevated={false}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: active
                          ? colors.primary
                          : colors.surfaceMuted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={v.icon}
                        size={22}
                        color={active ? "#fff" : colors.text}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text variant="body" style={{ fontWeight: "700" }}>
                        {v.label}
                      </Text>
                      <Text variant="bodySm" color="textSecondary">
                        {v.hint}
                      </Text>
                    </View>
                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </Card>
                </Pressable>
              );
            })}
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <Button
              label="Continue"
              onPress={() => setStep(2)}
              disabled={!type}
            />
          </View>
        </MotiView>
      )}

      {step === 2 && (
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <Text variant="h3" style={{ marginBottom: 8 }}>
            Verify your plate
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ marginBottom: spacing.lg }}
          >
            We'll automatically pull your vehicle details from the registry.
          </Text>

          <View style={{ gap: spacing.md }}>
            <View>
              <Input
                label="Plate number"
                placeholder="LAG-482-XA"
                value={plate}
                onChangeText={(v) => {
                  setPlate(v.toUpperCase());
                  setPlateVerified(false);
                  setPlateError(null);
                }}
                autoCapitalize="characters"
              />
              {plateError && (
                <Text variant="bodySm" color="danger" style={{ marginTop: 4 }}>
                  {plateError}
                </Text>
              )}
            </View>

            {/* Verification Button */}
            {!plateVerified ? (
              <Button
                label="Verify Plate"
                onPress={handleVerifyPlate}
                loading={verifyingPlate}
                disabled={plate.length < 5}
              />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: 12,
                  backgroundColor: colors.successMuted,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.success,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                />
                <Text
                  variant="body"
                  style={{ color: colors.success, fontWeight: "700" }}
                >
                  Plate Verified
                </Text>
              </View>
            )}

            {/* Show other inputs only after verification, or slightly faded out if not verified */}
            <View style={{ opacity: 0.5 }} pointerEvents={"none"}>
              <View style={{ gap: spacing.md, marginTop: spacing.md }}>
                <Input
                  label="Brand"
                  placeholder="Toyota"
                  value={brand}
                  onChangeText={setBrand}
                />
                <Input
                  label="Model"
                  placeholder="Corolla"
                  value={model}
                  onChangeText={setModel}
                />
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Year"
                      placeholder="2018"
                      value={year}
                      onChangeText={setYear}
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Color"
                      placeholder="Silver"
                      value={color}
                      onChangeText={setColor}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: spacing.xl }}>
            <Button
              label="Continue"
              onPress={() => setStep(3)}
              disabled={!step2Valid}
            />
          </View>
        </MotiView>
      )}

      {step === 3 && (
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <Text variant="h3" style={{ marginBottom: 8 }}>
            Review
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ marginBottom: spacing.lg }}
          >
            Confirm your vehicle details before we generate your QR code.
          </Text>

          <Card padding="lg">
            <ReviewRow label="Type" value={type?.toUpperCase() ?? "—"} />
            <ReviewRow label="Brand" value={brand} />
            <ReviewRow label="Model" value={model} />
            <ReviewRow label="Year" value={year} />
            <ReviewRow label="Color" value={color} />
            <ReviewRow label="Plate" value={plate} last />
          </Card>

          <Card
            padding="base"
            style={{
              marginTop: spacing.base,
              backgroundColor: colors.primaryMuted,
              borderColor: colors.primary,
              borderWidth: 1,
              flexDirection: "row",
            }}
            elevated={false}
          >
            <Ionicons
              name="qr-code"
              size={20}
              color={colors.primary}
              style={{ marginRight: 10 }}
            />
            <Text variant="bodySm" style={{ flex: 1 }}>
              A unique QR code will be generated for you to print and display in
              your vehicle.
            </Text>
          </Card>

          <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
            <Button
              label="Register vehicle & generate QR"
              onPress={submit}
              loading={saving}
            />
            <Button
              label="Edit details"
              variant="ghost"
              onPress={() => setStep(2)}
            />
          </View>
        </MotiView>
      )}
    </Screen>
  );
}

function ReviewRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text variant="body" color="textSecondary">
        {label}
      </Text>
      <Text variant="body" style={{ fontWeight: "700" }}>
        {value || "—"}
      </Text>
    </View>
  );
}
