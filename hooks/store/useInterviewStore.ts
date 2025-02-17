"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { InterviewResult } from "@prisma/client";

export type InterviewStore = {
  interviews: InterviewResult[];
  error: Error | null;
  addInterview: (values: InterviewResult) => void;
  deleteInterview: (id: string) => void;
  clearError: () => void;
};

export const useInterviewStore = create(
  persist<InterviewStore>(
    (set) => ({
      interviews: [],
      error: null,
      addInterview: (values) => {
        set((state) => {
          if (!values.id) {
            return { interviews: [...state.interviews, values] };
          }

          const exists = state.interviews.some((r) => r.id === values.id);

          return {
            ats: exists
              ? state.interviews.map((r) => (r.id === values.id ? values : r))
              : [...state.interviews, values],
          };
        });
      },
      deleteInterview: (id) => {
        set((state) => ({
          interviews: state.interviews.filter((r) => r.id !== id),
        }));
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "interviews-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
