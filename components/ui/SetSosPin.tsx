import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { radius, shadow, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/authStore";
import { authService } from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

interface SetSosPinModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SetSosPinModal({
  visible,
  onClose,
  onSuccess,
}: SetSosPinModalProps) {
  const { colors, theme } = useTheme();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus when modal opens
  useEffect(() => {
    if (visible) {
      setPin("");
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  const savePin = async () => {
    if (pin.length !== 4) return;
    setError(null);
    setLoading(true);

    try {
      await authService.setSosPin(pin);
      if (user) setUser({ ...user, sosPinSet: true });
      onSuccess(); // Triggers the actual SOS navigation in RiderHome!
    } catch (e: any) {
      setError(e.message || "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <BlurView
          intensity={theme === "dark" ? 40 : 20}
          tint={theme === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />

        {/* Invisible TextInput to capture native keyboard */}
        <TextInput
          ref={inputRef}
          value={pin}
          onChangeText={(t) => {
            setError(null);
            setPin(t.replace(/[^0-9]/g, "").slice(0, 4));
          }}
          keyboardType="number-pad"
          style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
        />

        <MotiView
          from={{ opacity: 0, translateY: 40, scale: 0.95 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: "spring", damping: 14 }}
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
            shadow.xl,
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[styles.iconWrap, { backgroundColor: colors.dangerMuted }]}
            >
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={colors.danger}
              />
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: colors.surfaceMuted },
              ]}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>

          <Text variant="h3" style={{ marginTop: spacing.lg }}>
            Set SOS PIN
          </Text>
          <Text
            variant="bodySm"
            color="textSecondary"
            style={{ marginTop: 6, lineHeight: 20 }}
          >
            Create a 4-digit PIN. You will need this to securely cancel an
            active SOS alert once it's triggered.
          </Text>

          {/* PIN Dots */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={styles.dotsWrap}
          >
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              const isActive = pin.length === index;

              return (
                <MotiView
                  key={index}
                  animate={{
                    scale: isFilled ? 1.1 : isActive ? 1.05 : 1,
                    backgroundColor: isFilled
                      ? colors.danger
                      : colors.surfaceMuted,
                    borderColor: isActive ? colors.danger : "transparent",
                  }}
                  transition={{ type: "spring", damping: 15 }}
                  style={[styles.dot, { borderWidth: isActive ? 2 : 0 }]}
                />
              );
            })}
          </Pressable>

          {error && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text
                variant="bodySm"
                color="danger"
                style={{ textAlign: "center", marginBottom: spacing.md }}
              >
                {error}
              </Text>
            </MotiView>
          )}

          <Button
            label="Save PIN"
            onPress={savePin}
            loading={loading}
            disabled={pin.length !== 4}
          />
        </MotiView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginVertical: spacing.xl,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 12,
  },
});
