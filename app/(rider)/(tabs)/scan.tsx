import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { radius, spacing } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');
const FRAME_SIZE = Math.min(SCREEN_W - 80, 320);

export default function ScanScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const scanned = useRef(false);

  // Scanning line animation
  const scanY = useSharedValue(0);
  React.useEffect(() => {
    scanY.value = withRepeat(
      withSequence(
        withTiming(FRAME_SIZE - 8, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [scanY]);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value }],
  }));

  const onScanned = useCallback((result: { data: string }) => {
    if (scanned.current) return;
    scanned.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.push({ pathname: '/verify-ride', params: { mode: 'qr', token: result.data } });
    setTimeout(() => { scanned.current = false; }, 2000);
  }, []);

  const openManual = () => {
    router.push({ pathname: '/verify-ride', params: { mode: 'plate' } });
  };

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  if (!permission.granted) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, padding: 20, paddingTop: insets.top + 40 }]}>
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <View
            style={{
              width: 96, height: 96, borderRadius: 48,
              backgroundColor: colors.primaryMuted,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="camera" size={40} color={colors.primary} />
          </View>
          <Text variant="h2" style={{ marginTop: 24, textAlign: 'center' }}>
            Scan vehicle QR codes
          </Text>
          <Text variant="body" color="textSecondary" style={{ marginTop: 8, textAlign: 'center' }}>
            BeSafe needs camera access to verify the vehicle you're about to enter.
          </Text>
        </View>

        <View style={{ marginTop: 'auto', paddingBottom: 40, gap: 12 }}>
          <Button label="Allow camera access" onPress={requestPermission} />
          <Button label="Enter plate number instead" variant="ghost" onPress={openManual} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={onScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* dim edges */}
        <View style={styles.overlayEdge} />
        <View style={styles.overlayRow}>
          <View style={styles.overlaySide} />
          <View style={[styles.frame, { width: FRAME_SIZE, height: FRAME_SIZE }]}>
            {/* Corner marks */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
              <View key={pos} style={[styles.corner, cornerPositions[pos], { borderColor: colors.primary }]} />
            ))}
            {/* Scan line */}
            <Animated.View
              style={[
                styles.scanLine,
                { backgroundColor: colors.primary, shadowColor: colors.primary },
                lineStyle,
              ]}
            />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayEdge} />
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.topBtn}>
          <Ionicons name="close" size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => setTorch((t) => !t)} style={styles.topBtn}>
          <Ionicons name={torch ? 'flash' : 'flash-outline'} size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Bottom info */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={[styles.bottom, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.bottomInner}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' }}>
            Point at the vehicle's QR code
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 8, fontSize: 14 }}>
            You'll find it on the windscreen or the back of the driver's seat
          </Text>

          <Pressable
            onPress={openManual}
            style={{
              marginTop: 20,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.35)',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="keypad" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '600' }}>Enter plate manually</Text>
          </Pressable>
        </View>
      </MotiView>
    </View>
  );
}

const cornerPositions: Record<'tl' | 'tr' | 'bl' | 'br', any> = {
  tl: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
  tr: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
  br: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayEdge: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  overlayRow: { flexDirection: 'row', height: FRAME_SIZE },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  frame: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30, height: 30,
  },
  scanLine: {
    position: 'absolute', left: 12, right: 12, height: 3, borderRadius: 3,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 10,
    ...Platform.select({ android: { elevation: 8 } }),
  },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12,
  },
  topBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  bottom: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: 20,
  },
  bottomInner: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 24,
    padding: 20,
  },
});
