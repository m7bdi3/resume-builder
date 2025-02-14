import { Prisma } from "@prisma/client";
import { CoverLetterValues, ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}
export interface CoverEditorFormProps {
  coverData: CoverLetterValues;
  setCoverData: (data: CoverLetterValues) => void;
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
  isResume: boolean;
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

export type CoverLetterServerData = Prisma.CoverLetterGetPayload<object>;
