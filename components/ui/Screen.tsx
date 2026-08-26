import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  scroll?: boolean;
  edges?: Edge[];
  keyboardAvoiding?: boolean;
  padding?: boolean;
  contentContainerStyle?: any;
  bg?: 'background' | 'surface' | 'surfaceElevated';
  hideStatusBar?: boolean;
}

export function Screen({
  scroll,
  edges = ['top', 'bottom'],
  keyboardAvoiding = true,
  padding = true,
  bg = 'background',
  contentContainerStyle,
  hideStatusBar,
  children,
  style,
  ...rest
}: Props) {
  const { colors, theme } = useTheme();

  const Body = (
    <View
      {...rest}
      style={[
        { flex: 1 },
        padding ? { paddingHorizontal: 20 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors[bg] }]}
    >
      {!hideStatusBar ? <StatusBar style={theme === 'dark' ? 'light' : 'dark'} /> : null}
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {scroll ? (
            <ScrollView
              style={styles.flex}
              contentContainerStyle={[
                padding ? { paddingHorizontal: 20, paddingBottom: 32 } : null,
                contentContainerStyle,
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : Body}
        </KeyboardAvoidingView>
      ) : (
        scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              padding ? { paddingHorizontal: 20, paddingBottom: 32 } : null,
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : Body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
