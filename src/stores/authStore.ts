// src\stores\authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { AuthService } from "../utils/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshAccessToken: () => Promise<boolean>;
  checkTokenExpiry: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const payload = AuthService.verifyToken(refreshToken);

          const newAccessToken = AuthService.generateAccessToken({
            user_id: payload.user_id,
            email: payload.email,
            role: payload.role,
          } as User);

          set({ accessToken: newAccessToken });
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      checkTokenExpiry: () => {
        const { accessToken, refreshAccessToken } = get();
        if (accessToken && AuthService.isTokenExpired(accessToken)) {
          refreshAccessToken();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
