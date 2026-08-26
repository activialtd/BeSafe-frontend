import { spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "./Text";

interface Props {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  hideBack?: boolean;
  transparent?: boolean;
}

export function Header({
  title,
  subtitle,
  onBack,
  right,
  hideBack,
  transparent,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        paddingTop: spacing.sm,
        paddingBottom: spacing.base,
        backgroundColor: transparent ? "transparent" : colors.background,
      }}
    >
      {/* Row 1 — back on the left, optional right slot on the right */}
      {(!hideBack || right) && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: title || subtitle ? spacing.base : 0,
          }}
        >
          {!hideBack ? (
            <Pressable
              onPress={onBack ?? (() => router.back())}
              hitSlop={12}
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceElevated,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
          ) : (
            <View />
          )}
          {right ?? <View />}
        </View>
      )}

      {/* Row 2 — title + subtitle, full width, natural wrapping */}
      {(title || subtitle) && (
        <View>
          {title ? <Text variant="h2">{title}</Text> : null}
          {subtitle ? (
            <Text
              variant="body"
              color="textSecondary"
              style={{ marginTop: 6, lineHeight: 22 }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}
