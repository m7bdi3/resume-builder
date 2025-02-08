import { EditorFormProps } from "@/lib/types";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { GeneralInfoForm } from "./forms/GeneralInfoForm";
import { SkillsForm } from "./forms/SkillsForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SummaryForm from "./forms/SummaryForm";
import { AdditionalInfoForm } from "./forms/AdditionalInfoForm";
import ProjectsForm from "./forms/ProjectsForm";

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
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
  {
    title: "Additional Info",
    component: AdditionalInfoForm,
    key: "additional-info",
  },
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "education",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skill",
  },
  {
    title: "Projects",
    component: ProjectsForm,
    key: "projects",
  },
  {
    title: "Certifications",
    component: SkillsForm,
    key: "certifications",
  },
  {
    title: "References",
    component: SkillsForm,
    key: "references",
  },
];
