import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  onboarding_complete: boolean;
}

interface AuthState {
  user: User | null;
  session: any | null;
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  logout: () => set({ user: null, session: null }),
}));

interface BPStatus {
  latestStatus: 'Normal' | 'Elevated' | 'Dangerous' | 'Ready';
  unreadAlertsCount: number;
}

interface UIState {
  status: BPStatus;
  theme: 'light' | 'dark';
  setLatestStatus: (status: BPStatus['latestStatus']) => void;
  setUnreadAlertsCount: (count: number) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  status: {
    latestStatus: 'Ready',
    unreadAlertsCount: 0,
  },
  theme: 'light',
  setLatestStatus: (latestStatus) => 
    set((state) => ({ status: { ...state.status, latestStatus } })),
  setUnreadAlertsCount: (unreadAlertsCount) => 
    set((state) => ({ status: { ...state.status, unreadAlertsCount } })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
