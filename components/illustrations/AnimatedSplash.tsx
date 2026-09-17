import { useTheme } from "@/contexts/ThemeContext";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

export function AnimatedSplash({ visible = true }: { visible?: boolean }) {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <MotiView
      from={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ type: "timing", duration: 400 }}
      style={[StyleSheet.absoluteFill, styles.root]}
      pointerEvents={visible ? "auto" : "none"}
    >
      {/* Background gradient */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="splashBg" cx="0.5" cy="0.4" r="0.7">
              <Stop offset="0" stopColor="#0F2F26" />
              <Stop offset="1" stopColor="#050B15" />
            </RadialGradient>
          </Defs>
          <Path
            d="M0 0 L 10000 0 L 10000 10000 L 0 10000 Z"
            fill="url(#splashBg)"
          />
        </Svg>
      </View>

      {/* Center stack */}
      <View style={styles.center}>
        {/* Pulsing rings behind the shield */}
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              loop: true,
              type: "timing",
              duration: 2400,
              delay: i * 700,
            }}
            style={styles.ring}
          />
        ))}

        {/* The shield itself, spring-scaled in */}
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, delay: 100 }}
        >
          <Svg width={140} height={160} viewBox="0 0 140 160">
            <Defs>
              <LinearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#10B981" />
                <Stop offset="1" stopColor="#047857" />
              </LinearGradient>
              <LinearGradient id="shieldHi" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
                <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Shield outline */}
            <Path
              d="M70 5 C 70 5, 15 18, 15 30 L 15 92 C 15 128, 70 155, 70 155 C 70 155, 125 128, 125 92 L 125 30 C 125 18, 70 5, 70 5 Z"
              fill="url(#shieldGrad)"
            />
            {/* Highlight sheen */}
            <Path
              d="M70 5 C 70 5, 15 18, 15 30 L 15 92 C 15 128, 70 155, 70 155 C 70 155, 125 128, 125 92 L 125 30 C 125 18, 70 5, 70 5 Z"
              fill="url(#shieldHi)"
            />
            {/* Checkmark */}
            <Path
              d="M42 80 L 62 100 L 100 55"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </MotiView>

        {/* Wordmark */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 400 }}
          style={{ marginTop: 24, alignItems: "center" }}
        >
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <MotiView
              from={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", duration: 800 }}
            >
              <SplashText color="#10B981" size={38} weight="800">
                Be
              </SplashText>
            </MotiView>
            <SplashText color="#FFFFFF" size={38} weight="800">
              Safe
            </SplashText>
          </View>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 400, delay: 700 }}
            style={{ marginTop: 8 }}
          >
            <SplashText
              color="rgba(255,255,255,0.6)"
              size={13}
              weight="500"
              letterSpacing={2}
            >
              VERIFY BEFORE YOU RIDE
            </SplashText>
          </MotiView>
        </MotiView>
      </View>

      {/* Bottom loading indicator */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 600, delay: 1000 }}
        style={styles.loaderWrap}
      >
        <View style={styles.loaderTrack}>
          <MotiView
            from={{ translateX: -80 }}
            animate={{ translateX: 80 }}
            transition={{ loop: true, type: "timing", duration: 1200 }}
            style={styles.loaderBar}
          />
        </View>
      </MotiView>
    </MotiView>
  );
}

// Bare Text substitute to avoid importing our themed Text (which itself calls useTheme
// and might not be ready at splash time in some flows). Uses raw RN Text.
import { Text as RNText } from "react-native";
function SplashText({
  children,
  color,
  size,
  weight = "600",
  letterSpacing,
}: {
  children: React.ReactNode;
  color: string;
  size: number;
  weight?: "400" | "500" | "600" | "700" | "800";
  letterSpacing?: number;
}) {
  return (
    <RNText
      style={{
        color,
        fontSize: size,
        fontWeight: weight,
        letterSpacing,
      }}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050B15",
    zIndex: 9999,
  },
  center: { alignItems: "center" },
  ring: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  loaderWrap: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
  loaderTrack: {
    width: 60,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  loaderBar: {
    width: 40,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#10B981",
  },
});
