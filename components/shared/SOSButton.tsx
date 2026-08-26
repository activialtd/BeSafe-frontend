import { Text } from '@/components/ui/Text';
import { shadow } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface Props {
  size?: 'compact' | 'full';
  onTrigger?: () => void;
  requireHold?: boolean;
  holdMs?: number;
}

/**
 * SOS Button:
 * - `compact` renders a circular floating pill for map overlays.
 * - `full`    renders the big red panic button used on the SOS screen.
 * Long-press by default to prevent accidental triggers.
 */
export function SOSButton({ size = 'compact', onTrigger, requireHold = true, holdMs = 1200 }: Props) {
  const { colors } = useTheme();
  const pulse = useSharedValue(1);
  const holdProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1200, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - (pulse.value - 1) / 0.35,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    height: `${holdProgress.value * 100}%`,
  }));

  const trigger = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    if (onTrigger) {
      onTrigger();
    } else {
      router.push('/sos');
    }
  };

  const startHold = () => {
    scale.value = withSpring(0.95);
    if (!requireHold) return;
    holdProgress.value = withTiming(1, { duration: holdMs, easing: Easing.linear });
  };

  const endHold = (didFire: boolean) => {
    scale.value = withSpring(1);
    if (requireHold) {
      const filled = holdProgress.value >= 0.98;
      holdProgress.value = withTiming(0, { duration: 200 });
      if (filled) trigger();
    } else if (didFire) {
      trigger();
    }
  };

  const s = size === 'compact' ? 62 : 180;
  const iconSize = size === 'compact' ? 26 : 68;
  const label = size === 'compact' ? 'SOS' : (requireHold ? 'HOLD FOR SOS' : 'SOS');

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: s + 30, height: s + 30 }}>
      {/* Pulsing ring */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: s,
            height: s,
            borderRadius: s / 2,
            backgroundColor: colors.danger,
            opacity: 0.35,
          },
          ringStyle,
        ]}
      />

      <Pressable
        onPress={requireHold ? undefined : () => endHold(true)}
        onPressIn={startHold}
        onPressOut={() => endHold(false)}
        hitSlop={12}
      >
        <Animated.View
          style={[
            {
              width: s,
              height: s,
              borderRadius: s / 2,
              backgroundColor: colors.danger,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: size === 'full' ? 4 : 2,
              borderColor: 'rgba(255,255,255,0.25)',
            },
            shadow.lg,
            btnStyle,
          ]}
        >
          {/* Hold fill from bottom */}
          {requireHold && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                },
                progressStyle,
              ]}
            />
          )}

          <Ionicons name="warning" size={iconSize} color="#FFFFFF" />
          {size === 'full' ? (
            <Text
              style={{
                marginTop: 8,
                color: '#FFFFFF',
                fontWeight: '800',
                letterSpacing: 1.5,
                fontSize: 13,
              }}
            >
              {label}
            </Text>
          ) : (
            <Text
              style={{
                marginTop: 2,
                color: '#FFFFFF',
                fontWeight: '800',
                letterSpacing: 1,
                fontSize: 11,
              }}
            >
              SOS
            </Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}
