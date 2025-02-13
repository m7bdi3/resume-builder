"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Import persist middleware
import { deleteResume, getAllResumes } from "@/actions/prisma.actions";
import { ResumeValues } from "@/lib/validation";
import { saveResume } from "@/actions/forms.actions";
import { ResumeServerData } from "@/lib/types";

export type ResumeStore = {
  resumes: ResumeServerData[];
  isLoading: boolean;
  error: Error | null;
  fetchResumes: () => Promise<void>;
  createResume: (values: ResumeValues) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
};

export const useResumeStore = create(
  persist<ResumeStore>(
    (set) => ({
      resumes: [],
      isLoading: false,
      error: null,
      fetchResumes: async () => {
        set({ isLoading: true, error: null });
        try {
          const resumes = await getAllResumes();
          set({ resumes, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error
                : new Error("An unknown error occurred"),
            isLoading: false,
          });
        }
      },
      createResume: async (values: ResumeValues) => {
        set({ isLoading: true, error: null });
        try {
          const savedResume = await saveResume(values);
          set((state) => {
            const updatedResumes = values.id
              ? state.resumes.map((resume) =>
                  resume.id === savedResume.id ? savedResume : resume
                )
              : [...state.resumes, savedResume];
            return {
              resumes: updatedResumes,
              isLoading: false,
            } as Partial<ResumeStore>;
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error
                : new Error("An unknown error occurred"),
            isLoading: false,
          });
        }
      },
      deleteResume: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await deleteResume(id);
          set((state) => ({
            resumes: state.resumes.filter((r) => r.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error
                : new Error("An unknown error occurred"),
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "resume-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
