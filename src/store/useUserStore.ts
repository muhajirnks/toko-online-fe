import { create } from "zustand";
import { type User } from "@/types/api/auth.type";

interface UseUserStore {
   user: User | null;
   setUser: (data: User | null) => void;
   loading: boolean;
   setLoading: (loading: boolean) => void
}

export const useUserStore = create<UseUserStore>((set) => ({
   user: null,
   setUser: (data) => set({ user: data }),
   loading: false,
   setLoading: (loading: boolean) => set({ loading, }),
}));

