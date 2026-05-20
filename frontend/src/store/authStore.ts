import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales';
  token: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
  initAuth: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        set({ user: JSON.parse(storedUser) });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  },
}));
