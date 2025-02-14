"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CoverLetterServerData } from "@/lib/types";

type CoverStore = {
  covers: CoverLetterServerData[];
  addCover: (values: CoverLetterServerData) => void;
  deleteCover: (id: string) => void;
};

export const useCoverStore = create(
  persist<CoverStore>(
    (set) => ({
      covers: [],

      addCover: (values) => {
        set((state) => {
          if (!values.id) {
            return { covers: [...state.covers, values] };
          }

          const exists = state.covers.some((c) => c.id === values.id);

          return {
            covers: exists
              ? state.covers.map((c) => (c.id === values.id ? values : c))
              : [...state.covers, values],
          };
        });
      },

      deleteCover: (id) => {
        set((state) => ({
          covers: state.covers.filter((r) => r.id !== id),
        }));
      },
    }),
    {
      name: "cover-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
