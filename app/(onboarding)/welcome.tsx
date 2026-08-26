import {
  IllustrationShare,
  IllustrationSos,
  IllustrationVerify,
} from "@/components/illustrations/OnboardingIllustrations";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/constants/Theme";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "verify",
    Illustration: IllustrationVerify,
    title: "Know who you're entering",
    body: "Scan the QR sticker inside any bus, keke or taxi. If the vehicle isn't registered, you'll know before you sit down.",
  },
  {
    key: "share",
    Illustration: IllustrationShare,
    title: "Your people, on the trip with you",
    body: "Send your live location to family or friends in one tap. They'll see where you are the whole way.",
  },
  {
    key: "sos",
    Illustration: IllustrationSos,
    title: "Help, without saying a word",
    body: "Hold the SOS button. We alert emergency services, share your live location, and text everyone on your list. All at once.",
  },
];

export default function Welcome() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const goNext = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    } else {
      router.push("/(onboarding)/role");
    }
  };

  const skip = () => router.push("/(onboarding)/role");

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <StatusBar barStyle="default" />

      {/* Top row: logo + skip */}
      <View style={[styles.header, { paddingHorizontal: 20 }]}>
        <LogoMark size={30} />
        {index < slides.length - 1 ? (
          <Pressable onPress={skip} hitSlop={12}>
            <Text
              variant="body"
              color="textSecondary"
              style={{ fontWeight: "600" }}
            >
              Skip
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Swipeable slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((s) => {
          const Ill = s.Illustration;
          return (
            <View key={s.key} style={[styles.slide, { width }]}>
              <View style={{ marginBottom: spacing.xl }}>
                <Ill size={280} />
              </View>
              <MotiView
                from={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400 }}
                key={`title-${index}`}
                style={{ paddingHorizontal: 32 }}
              >
                <Text
                  variant="displaySm"
                  align="center"
                  style={{ marginBottom: spacing.md }}
                >
                  {s.title}
                </Text>
                <Text
                  variant="bodyLg"
                  color="textSecondary"
                  align="center"
                  style={{ lineHeight: 24 }}
                >
                  {s.body}
                </Text>
              </MotiView>
            </View>
          );
        })}
      </ScrollView>

      {/* Pagination + CTA */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        }}
      >
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <MotiView
              key={i}
              animate={{
                width: i === index ? 24 : 8,
                backgroundColor: i === index ? colors.primary : colors.border,
              }}
              transition={{ type: "timing", duration: 220 }}
              style={styles.dot}
            />
          ))}
        </View>
        <Button
          label={index === slides.length - 1 ? "Get started" : "Continue"}
          onPress={goNext}
        />
        {index === slides.length - 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: spacing.md,
            }}
          >
            <Text variant="bodySm" color="textSecondary">
              Already have an account?{" "}
            </Text>
            <Pressable
              onPress={() => router.push("/(onboarding)/phone")}
              hitSlop={8}
            >
              <Text
                variant="bodySm"
                color="primary"
                style={{ fontWeight: "700" }}
              >
                Sign in
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
