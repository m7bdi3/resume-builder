"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { GapResult } from "@prisma/client";

export type GapStore = {
  gaps: GapResult[];
  error: Error | null;
  isLoading: boolean;
  addGap: (values: GapResult) => void;
  deleteGap: (id: string) => void;
  clearError: () => void;
};

export const useGapStore = create(
  persist<GapStore>(
    (set) => ({
      gaps: [],
      isLoading: false,
      error: null,
      addGap: (values) => {
        set((state) => {
          if (!values.id) {
            return { gaps: [...state.gaps, values] };
          }

          const exists = state.gaps.some((r) => r.id === values.id);

          return {
            ats: exists
              ? state.gaps.map((r) => (r.id === values.id ? values : r))
              : [...state.gaps, values],
          };
        });
      },
      deleteGap: (id) => {
        set((state) => ({
          gaps: state.gaps.filter((r) => r.id !== id),
        }));
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "gaps-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
