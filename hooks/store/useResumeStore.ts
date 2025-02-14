"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ResumeServerData } from "@/lib/types";

export type ResumeStore = {
  resumes: ResumeServerData[];
  addResume: (values: ResumeServerData) => void;
  deleteResume: (id: string) => void;
};

export const useResumeStore = create(
  persist<ResumeStore>(
    (set) => ({
      resumes: [],
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
    }),
    {
      name: "resume-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
