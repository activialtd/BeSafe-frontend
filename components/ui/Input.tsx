import { radius, spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import React, { forwardRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Text } from "./Text";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  validate?: (value: string) => string | null;
  validateOnBlur?: boolean;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  {
    label,
    error: externalError,
    hint,
    leftAdornment,
    rightAdornment,
    style,
    onFocus,
    onBlur,
    onChangeText,
    validate,
    validateOnBlur = true,
    value,
    ...rest
  },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  // External error takes precedence over internal validation
  const shownError =
    externalError ?? (touched && !focused ? internalError : null);

  const borderColor = shownError
    ? colors.danger
    : focused
      ? colors.primary
      : colors.border;

  const handleChange = (v: string) => {
    if (validate) {
      const err = validate(v);
      setInternalError(err);
    }
    onChangeText?.(v);
  };

  return (
    <View style={{ marginBottom: spacing.base }}>
      {label ? (
        <Text
          variant="caption"
          color={shownError ? "danger" : "textSecondary"}
          style={{
            marginBottom: spacing.xs + 2,
            marginLeft: 2,
            letterSpacing: 0.3,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor,
            borderRadius: radius.md,
            borderWidth: shownError || focused ? 1.5 : 1,
          },
        ]}
      >
        {leftAdornment ? (
          <View style={styles.adornment}>{leftAdornment}</View>
        ) : null}
        <TextInput
          ref={ref}
          {...rest}
          value={value}
          onChangeText={handleChange}
          placeholderTextColor={colors.textTertiary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (validateOnBlur) setTouched(true);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              color: colors.text,
              // Explicit vertical centering — the trick is textAlignVertical on Android
              // + line-height matching font-size so there's no baseline drift
              fontSize: 16,
              lineHeight: Platform.OS === "ios" ? 20 : 22,
              paddingTop: 0,
              paddingBottom: 0,
              includeFontPadding: false,
              textAlignVertical: "center",
            },
            style,
          ]}
        />
        {rightAdornment ? (
          <View style={styles.adornment}>{rightAdornment}</View>
        ) : null}
      </View>
      {shownError || hint ? (
        <Text
          variant="caption"
          color={shownError ? "danger" : "textTertiary"}
          style={{ marginTop: 6, marginLeft: 2 }}
        >
          {shownError || hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    height: 56,
  },
  adornment: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xs,
  },
  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    margin: 0,
  },
});
