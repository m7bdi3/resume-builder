import { EditorFormProps } from "@/lib/types";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { GeneralInfoForm } from "./forms/GeneralInfoForm";
import { WorkExperienceForm } from "./forms/WorkExperienceForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  {
    title: "General info",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    title: "Personal info",
    component: PersonalInfoForm,
    key: "personal-info",
  },
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
];
