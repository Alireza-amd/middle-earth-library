import { TFullUser } from "@/auth/currentUser";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user: TFullUser | null;
  setUser: (user: TFullUser) => void;
  signOut: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "user-storage" }
  )
);
