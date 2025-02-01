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