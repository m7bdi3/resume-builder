import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export interface ResumeSectionProps {
  resumeData: ResumeValues;
}

export interface FooterProps {
  isSaving: boolean;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowResumePreview: (show: boolean) => void;
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
  projects: true,
  references: true,
  certifications: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;
