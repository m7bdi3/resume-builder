"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ResumeServerData } from "@/lib/types";
import { SubscriptionLevel } from "@/lib/subscription";

export type ResumeStore = {
  resumes: ResumeServerData[];
  error: Error | null;
  addResume: (values: ResumeServerData) => void;
  deleteResume: (id: string) => void;
  subLevel: SubscriptionLevel;
  canCreate: boolean;
  clearError: () => void;
};

export const useResumeStore = create(
  persist<ResumeStore>(
    (set) => ({
      resumes: [],
      error: null,

      subLevel: "free",
      canCreate: false,
      addResume: (values) => {
        set((state) => {
          if (!values.id) {
            return { resumes: [...state.resumes, values] };
          }

          const exists = state.resumes.some((r) => r.id === values.id);

          return {
            resumes: exists
              ? state.resumes.map((r) => (r.id === values.id ? values : r))
              : [...state.resumes, values],
          };
        });
      },

      deleteResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
        }));
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "resume-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
