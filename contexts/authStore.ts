import { authService } from '@/services/auth.service';
import { User, UserRole } from '@/types';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  // during onboarding
  pendingRole: UserRole | null;
  pendingPhone: string | null;
  pendingNin: string | null;

  hydrate: () => Promise<void>;
  setPendingRole: (r: UserRole) => void;
  setPendingPhone: (p: string) => void;
  setPendingNin: (n: string) => void;
  finishOnboarding: () => Promise<User>;
  setUser: (u: User) => void;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  hydrated: false,
  pendingRole: null,
  pendingPhone: null,
  pendingNin: null,

  async hydrate() {
    set({ loading: true });
    const user = await authService.me();
    set({ user, loading: false, hydrated: true });
  },

  setPendingRole: (r) => set({ pendingRole: r }),
  setPendingPhone: (p) => set({ pendingPhone: p }),
  setPendingNin: (n) => set({ pendingNin: n }),

  async finishOnboarding() {
    const role = get().pendingRole ?? 'rider';
    set({ loading: true });
    const user = await authService.setRole(role);
    set({ user, loading: false });
    return user;
  },

  setUser: (u) => set({ user: u }),

  async signOut() {
    await authService.logout();
    set({
      user: null,
      pendingRole: null,
      pendingPhone: null,
      pendingNin: null,
    });
  },
}));
