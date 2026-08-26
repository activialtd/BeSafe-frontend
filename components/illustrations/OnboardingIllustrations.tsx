import { useTheme } from "@/contexts/ThemeContext";
import { MotiView } from "moti";
import React from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

type Props = { size?: number };

/**
 * Illustration 1 — VERIFY
 * A woman stands next to a Lagos danfo, holding up her phone.
 * A large verified checkmark blooms out above the phone.
 */
export function IllustrationVerify({ size = 280 }: Props) {
  const { colors, theme } = useTheme();
  const skin = "#B37A5F";
  const hair = "#1A1A1A";
  const bg = theme === "dark" ? "#0F1A2E" : "#E7F7EF";
  const clothes = colors.primary;
  const bus = "#F5C244"; // classic Lagos danfo yellow

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MotiView
        from={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: 1.04, opacity: 1 }}
        transition={{ loop: true, type: "timing", duration: 2400 }}
        style={{
          position: "absolute",
          width: size * 0.92,
          height: size * 0.92,
          borderRadius: size,
          backgroundColor: bg,
        }}
      />
      <Svg width={size} height={size} viewBox="0 0 280 280">
        <Defs>
          <LinearGradient id="checkGlow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primary} />
            <Stop offset="1" stopColor="#059669" />
          </LinearGradient>
          <RadialGradient id="floor" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#000" stopOpacity="0.15" />
            <Stop offset="1" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Ellipse cx="140" cy="245" rx="90" ry="10" fill="url(#floor)" />

        {/* Palm-tree hint on the right */}
        <G opacity="0.4">
          <Rect x="238" y="130" width="4" height="90" rx="2" fill="#5B3A1E" />
          <Path
            d="M240 130 C 230 120, 218 118, 210 122 C 220 122, 230 128, 240 130"
            fill="#2F7A4A"
          />
          <Path
            d="M240 130 C 250 120, 262 118, 270 122 C 260 122, 250 128, 240 130"
            fill="#2F7A4A"
          />
          <Path
            d="M240 130 C 235 118, 232 108, 236 100 C 238 110, 240 122, 240 130"
            fill="#2F7A4A"
          />
        </G>

        {/* Danfo bus */}
        <G>
          <Rect x="20" y="150" width="115" height="60" rx="6" fill={bus} />
          <Rect x="20" y="150" width="115" height="8" fill="#D9A930" />
          <Rect
            x="30"
            y="162"
            width="30"
            height="22"
            rx="2"
            fill={theme === "dark" ? "#1F2937" : "#BEE3F8"}
          />
          <Rect
            x="65"
            y="162"
            width="30"
            height="22"
            rx="2"
            fill={theme === "dark" ? "#1F2937" : "#BEE3F8"}
          />
          <Rect
            x="100"
            y="162"
            width="30"
            height="22"
            rx="2"
            fill={theme === "dark" ? "#1F2937" : "#BEE3F8"}
          />
          <Rect
            x="120"
            y="150"
            width="1.5"
            height="60"
            fill="#8A6812"
            opacity="0.5"
          />
          {/* Black stripes — Lagos danfo signature */}
          <Rect
            x="20"
            y="188"
            width="115"
            height="6"
            fill="#000"
            opacity="0.85"
          />
          <Circle cx="45" cy="215" r="10" fill="#1A1A1A" />
          <Circle cx="45" cy="215" r="4" fill="#555" />
          <Circle cx="115" cy="215" r="10" fill="#1A1A1A" />
          <Circle cx="115" cy="215" r="4" fill="#555" />
        </G>

        {/* Person */}
        <G>
          <Rect x="150" y="185" width="8" height="45" rx="3" fill="#2A2A3E" />
          <Rect x="162" y="185" width="8" height="45" rx="3" fill="#2A2A3E" />
          <Ellipse cx="154" cy="232" rx="6" ry="3" fill="#111" />
          <Ellipse cx="166" cy="232" rx="6" ry="3" fill="#111" />
          <Path d="M144 135 L 176 135 L 180 190 L 140 190 Z" fill={clothes} />
          {/* Raised arm holding phone */}
          <Path
            d="M175 145 Q 195 130, 200 110 L 208 112 Q 202 138, 182 152 Z"
            fill={skin}
          />
          {/* Hanging arm */}
          <Path d="M144 145 L 138 185 L 145 188 L 150 148 Z" fill={skin} />
          <Rect x="156" y="128" width="8" height="10" fill={skin} />
          <Circle cx="160" cy="118" r="14" fill={skin} />
          {/* Hair */}
          <Path
            d="M147 112 C 147 102, 173 102, 173 112 C 173 108, 168 105, 160 105 C 152 105, 147 108, 147 112 Z"
            fill={hair}
          />
          <Circle cx="149" cy="115" r="4" fill={hair} />
          <Circle cx="171" cy="115" r="4" fill={hair} />

          {/* Phone */}
          <Rect
            x="196"
            y="82"
            width="26"
            height="42"
            rx="4"
            fill={theme === "dark" ? "#1F2937" : "#111"}
          />
          <Rect
            x="199"
            y="86"
            width="20"
            height="34"
            rx="2"
            fill={theme === "dark" ? "#0A0E1A" : "#F9FAFB"}
          />
          <Rect
            x="202"
            y="90"
            width="4"
            height="4"
            fill={colors.text}
            opacity="0.6"
          />
          <Rect
            x="212"
            y="90"
            width="4"
            height="4"
            fill={colors.text}
            opacity="0.6"
          />
          <Rect
            x="202"
            y="112"
            width="4"
            height="4"
            fill={colors.text}
            opacity="0.6"
          />
          <Rect
            x="207"
            y="98"
            width="4"
            height="4"
            fill={colors.text}
            opacity="0.4"
          />
          <Rect
            x="212"
            y="105"
            width="4"
            height="4"
            fill={colors.text}
            opacity="0.4"
          />
        </G>

        {/* Verified checkmark blooming above the phone */}
        <G>
          <Circle cx="209" cy="55" r="26" fill="url(#checkGlow)" />
          <Circle
            cx="209"
            cy="55"
            r="26"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <Path
            d="M198 55 L 206 63 L 220 48"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>

        {/* Sparkles */}
        <Circle cx="180" cy="45" r="2" fill={colors.primary} />
        <Circle cx="240" cy="70" r="2.5" fill={colors.primary} />
        <Circle cx="235" cy="35" r="1.5" fill={colors.primary} />
        <Circle cx="175" cy="75" r="1.5" fill={colors.primary} />
      </Svg>
    </View>
  );
}

/**
 * Illustration 2 — SHARE / LIVE TRACKING
 * Map card with a live person pin at the center; two chat-bubble watchers
 * on either side connected by dashed lines showing the trip stream.
 */
export function IllustrationShare({ size = 280 }: Props) {
  const { colors, theme } = useTheme();
  const bg = theme === "dark" ? "#1E1B3A" : "#F0EEFA";
  const skin = "#B37A5F";

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size * 0.92,
          height: size * 0.92,
          borderRadius: size,
          backgroundColor: bg,
        }}
      />
      <Svg width={size} height={size} viewBox="0 0 280 280">
        <Defs>
          <LinearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop
              offset="0"
              stopColor={theme === "dark" ? "#1F2937" : "#FFFFFF"}
            />
            <Stop
              offset="1"
              stopColor={theme === "dark" ? "#111827" : "#F3F4F6"}
            />
          </LinearGradient>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Map card */}
        <G>
          <Rect
            x="60"
            y="70"
            width="160"
            height="140"
            rx="16"
            fill="url(#mapGrad)"
            stroke={colors.border}
            strokeWidth="1.5"
          />
          {/* Grid streets */}
          <Path
            d="M60 110 L 220 110"
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />
          <Path
            d="M60 150 L 220 150"
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />
          <Path
            d="M60 185 L 220 185"
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />
          <Path
            d="M100 70 L 100 210"
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />
          <Path
            d="M150 70 L 150 210"
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />
          <Path
            d="M185 70 L 185 210"
            stroke={colors.border}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Route */}
          <Path
            d="M85 190 Q 110 170, 130 175 T 175 130 T 200 95"
            stroke="url(#routeGrad)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />

          {/* Start dot */}
          <Circle cx="85" cy="190" r="5" fill={colors.textTertiary} />
          <Circle cx="85" cy="190" r="2" fill="white" />

          {/* Live person pin (animated) */}
          <MotiView
            from={{ translateX: 0, translateY: 0 }}
            animate={{ translateX: 20, translateY: -10 }}
            transition={{ loop: true, type: "timing", duration: 3000 }}
          >
            <G transform="translate(120, 150)">
              <Circle
                cx="0"
                cy="0"
                r="22"
                fill={colors.primary}
                opacity="0.15"
              />
              <Circle
                cx="0"
                cy="0"
                r="16"
                fill={colors.primary}
                opacity="0.3"
              />
              <Circle
                cx="0"
                cy="0"
                r="12"
                fill={colors.primary}
                stroke="white"
                strokeWidth="2.5"
              />
              <Circle cx="0" cy="-3" r="3" fill="white" />
              <Path d="M-5 6 Q 0 1, 5 6 L 5 8 L -5 8 Z" fill="white" />
            </G>
          </MotiView>
        </G>

        {/* Watcher 1 — top-left chat bubble */}
        <G>
          <Path
            d="M20 55 L 60 55 Q 68 55, 68 63 L 68 90 Q 68 98, 60 98 L 42 98 L 34 108 L 36 98 L 28 98 Q 20 98, 20 90 Z"
            fill={theme === "dark" ? "#1F2937" : "#FFFFFF"}
            stroke={colors.border}
            strokeWidth="1.5"
          />
          <Circle cx="35" cy="76" r="8" fill="#FFB1C1" />
          <Circle cx="33" cy="75" r="1" fill="#000" />
          <Circle cx="37" cy="75" r="1" fill="#000" />
          <Path
            d="M32 79 Q 35 81, 38 79"
            stroke="#000"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <Rect
            x="46"
            y="72"
            width="18"
            height="2.5"
            rx="1.25"
            fill={colors.textTertiary}
          />
          <Rect
            x="46"
            y="78"
            width="14"
            height="2.5"
            rx="1.25"
            fill={colors.textTertiary}
          />
        </G>

        {/* Watcher 2 — bottom-right chat bubble */}
        <G>
          <Path
            d="M215 190 L 255 190 Q 263 190, 263 198 L 263 225 Q 263 233, 255 233 L 245 233 L 253 243 L 231 233 L 223 233 Q 215 233, 215 225 Z"
            fill={theme === "dark" ? "#1F2937" : "#FFFFFF"}
            stroke={colors.border}
            strokeWidth="1.5"
          />
          <Circle cx="230" cy="211" r="8" fill={skin} />
          <Circle cx="228" cy="210" r="1" fill="#000" />
          <Circle cx="232" cy="210" r="1" fill="#000" />
          <Path
            d="M227 214 Q 230 216, 233 214"
            stroke="#000"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <Rect
            x="241"
            y="207"
            width="18"
            height="2.5"
            rx="1.25"
            fill={colors.textTertiary}
          />
          <Rect
            x="241"
            y="213"
            width="14"
            height="2.5"
            rx="1.25"
            fill={colors.textTertiary}
          />
        </G>

        {/* Connection dashes from watchers to pin */}
        <Path
          d="M55 100 Q 90 120, 120 148"
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeDasharray="2 3"
          fill="none"
          opacity="0.6"
        />
        <Path
          d="M225 185 Q 190 170, 145 152"
          stroke={colors.primary}
          strokeWidth="1.5"
          strokeDasharray="2 3"
          fill="none"
          opacity="0.6"
        />
      </Svg>
    </View>
  );
}

/**
 * Illustration 3 — SOS
 * A hand presses a large SOS button. Radiating alert waves + small
 * recipient badges (police shield, medical cross, contact avatar).
 */
export function IllustrationSos({ size = 280 }: Props) {
  const { colors, theme } = useTheme();
  const skin = "#B37A5F";
  const bg = theme === "dark" ? "#3D1A1A" : "#FEE2E2";

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size * 0.92,
          height: size * 0.92,
          borderRadius: size,
          backgroundColor: bg,
        }}
      />

      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ scale: 0.7, opacity: 0.7 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 2200,
            delay: i * 700,
          }}
          style={{
            position: "absolute",
            width: size * 0.42,
            height: size * 0.42,
            borderRadius: size,
            borderWidth: 3,
            borderColor: colors.danger,
          }}
        />
      ))}

      <Svg width={size} height={size} viewBox="0 0 280 280">
        <Defs>
          <RadialGradient id="btnGrad" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#EF4444" />
            <Stop offset="1" stopColor="#991B1B" />
          </RadialGradient>
          <LinearGradient id="btnHighlight" x1="0.3" y1="0" x2="0.7" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* SOS button */}
        <G>
          <Circle cx="140" cy="145" r="60" fill="url(#btnGrad)" />
          <Circle cx="140" cy="145" r="60" fill="url(#btnHighlight)" />
          <Circle
            cx="140"
            cy="145"
            r="52"
            fill="none"
            stroke="#FFF"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          {/* SOS letters */}
          <G fill="#FFF">
            <Path d="M112 130 h 12 v 4 h -8 v 4 h 8 v 12 h -12 v -4 h 8 v -4 h -8 z" />
            <Path
              fillRule="evenodd"
              d="M130 130 h 14 v 20 h -14 z M134 134 v 12 h 6 v -12 z"
            />
            <Path d="M150 130 h 12 v 4 h -8 v 4 h 8 v 12 h -12 v -4 h 8 v -4 h -8 z" />
          </G>
        </G>

        {/* Hand pressing button */}
        <G>
          <Path
            d="M215 220 L 265 268 L 280 268 L 280 205 Z"
            fill={colors.primary}
          />
          <Path
            d="M180 175 C 175 170, 175 160, 185 155 L 220 170 C 230 175, 232 185, 225 195 L 210 218 C 205 226, 195 226, 190 220 Z"
            fill={skin}
          />
          <Path
            d="M170 155 C 165 148, 170 140, 178 142 L 195 165 C 200 172, 195 180, 188 180 Z"
            fill={skin}
          />
          <Circle cx="172" cy="148" r="4" fill={skin} />
        </G>

        {/* Recipients */}
        <G>
          <Circle
            cx="45"
            cy="60"
            r="20"
            fill={theme === "dark" ? "#1F2937" : "#FFFFFF"}
            stroke={colors.danger}
            strokeWidth="2"
          />
          <Path
            d="M45 50 L 52 53 L 52 62 C 52 66, 48 70, 45 72 C 42 70, 38 66, 38 62 L 38 53 Z"
            fill={colors.danger}
          />
          <Path
            d="M41 62 L 44 65 L 49 58"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </G>

        <G>
          <Circle
            cx="235"
            cy="60"
            r="20"
            fill={theme === "dark" ? "#1F2937" : "#FFFFFF"}
            stroke={colors.danger}
            strokeWidth="2"
          />
          <Rect
            x="231"
            y="51"
            width="8"
            height="18"
            rx="2"
            fill={colors.danger}
          />
          <Rect
            x="226"
            y="56"
            width="18"
            height="8"
            rx="2"
            fill={colors.danger}
          />
        </G>

        <G>
          <Circle
            cx="55"
            cy="220"
            r="20"
            fill={theme === "dark" ? "#1F2937" : "#FFFFFF"}
            stroke={colors.danger}
            strokeWidth="2"
          />
          <Circle cx="55" cy="216" r="5" fill={colors.danger} />
          <Path
            d="M45 232 Q 55 224, 65 232 L 65 234 L 45 234 Z"
            fill={colors.danger}
          />
        </G>

        {/* Alert dashes to each recipient */}
        <Path
          d="M90 105 L 60 75"
          stroke={colors.danger}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <Path
          d="M190 105 L 220 75"
          stroke={colors.danger}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <Path
          d="M95 190 L 70 210"
          stroke={colors.danger}
          strokeWidth="2"
          strokeDasharray="3 3"
          opacity="0.5"
        />
      </Svg>
    </View>
  );
}
