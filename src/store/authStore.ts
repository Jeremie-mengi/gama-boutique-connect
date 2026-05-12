import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  sexe: string;
  dossier: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginData {
  connected_user: User;
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;

  login: (data: LoginData, remember: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      expiresAt: null,

      login: (data, remember) => {
        const expiresAt = remember
          ? Date.now() + 7 * 24 * 60 * 60 * 1000
          : Date.now() + 24 * 60 * 60 * 1000;

        set({
          user: data.connected_user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          isAuthenticated: true,
          expiresAt,
        });
      },

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          expiresAt: null,
        }),

      checkAuth: () => {
        const expiresAt = get().expiresAt;

        if (!expiresAt || Date.now() > expiresAt) {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);