import { create } from "zustand";
import type { Category } from "@/types/api/category.type";
import { listCategories } from "@/services/category.service";

interface CategoryStore {
   categories: Category[];
   isLoading: boolean;
   error: string | null;
   fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
   categories: [],
   isLoading: false,
   error: null,
   fetchCategories: async () => {
      set({ isLoading: true, error: null });
      try {
         const { data, error } = await listCategories();
         if (error) throw error;
         set({ categories: data?.data || [], isLoading: false });
      } catch (err: any) {
         set({ error: err.message || "Failed to fetch categories", isLoading: false });
      }
   },
}));
