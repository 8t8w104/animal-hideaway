import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  role: 'general' | 'staff' | null;
  isLoggedIn: boolean;
  setUserId: (userId: string | null) => void;
  setRole: (role: 'general' | 'staff' | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  role: null,
  isLoggedIn: false,
  setUserId: (userId) => set({ userId }),
  setRole: (role) => set({ role }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));
