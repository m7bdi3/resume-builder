"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { atsResult } from "@prisma/client";

export type AtsStore = {
  ats: atsResult[];
  error: Error | null;
  addAts: (values: atsResult) => void;
  deleteAts: (id: string) => void;
  clearError: () => void;
};

export const useAtsStore = create(
  persist<AtsStore>(
    (set) => ({
      ats: [],
      error: null,
      addAts: (values) => {
        set((state) => {
          if (!values.id) {
            return { ats: [...state.ats, values] };
          }

          const exists = state.ats.some((r) => r.id === values.id);

          return {
            ats: exists
              ? state.ats.map((r) => (r.id === values.id ? values : r))
              : [...state.ats, values],
          };
        });
      },

      deleteAts: (id) => {
        set((state) => ({
          ats: state.ats.filter((r) => r.id !== id),
        }));
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "ats-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
