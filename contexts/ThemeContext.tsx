import { Colors, ThemeColors, ThemeName } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemePref = 'system' | ThemeName;

interface Ctx {
  theme: ThemeName;
  colors: ThemeColors;
  pref: ThemePref;
  setPref: (p: ThemePref) => void;
  toggle: () => void;
}

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = 'besafe.theme-pref';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() ?? 'dark';
  const [pref, setPrefState] = useState<ThemePref>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') setPrefState(v);
    });
  }, []);

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p);
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {});
  }, []);

  const theme: ThemeName = pref === 'system' ? (system as ThemeName) : pref;
  const colors = Colors[theme];

  const toggle = useCallback(() => setPref(theme === 'dark' ? 'light' : 'dark'), [theme, setPref]);

  const value = useMemo<Ctx>(() => ({ theme, colors, pref, setPref, toggle }), [theme, colors, pref, setPref, toggle]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
