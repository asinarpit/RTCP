import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  name?: string;
  color: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("rtcp_user") || "null"),
  token: localStorage.getItem("rtcp_token"),
  isAuthenticated: !!localStorage.getItem("rtcp_token"),

  login: (user, token) => {
    localStorage.setItem("rtcp_token", token);
    localStorage.setItem("rtcp_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("rtcp_token");
    localStorage.removeItem("rtcp_user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
