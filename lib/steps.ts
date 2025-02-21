import { EditorFormProps } from "@/lib/types";

import { SkillsForm } from "@/components/forms/resume/SkillsForm";
import WorkExperienceForm from "@/components/forms/resume/WorkExperienceForm";
import EducationForm from "@/components/forms/resume/EducationForm";
import SummaryForm from "@/components/forms/resume/SummaryForm";
import { AdditionalInfoForm } from "@/components/forms/resume/AdditionalInfoForm";
import ProjectsForm from "@/components/forms/resume/ProjectsForm";
import CertificationsForm from "@/components/forms/resume/CertificationsForm";
import RefrencesForm from "@/components/forms/resume/RefrenceForm";
import GeneralInfoForm from "@/components/forms/resume/GeneralInfoForm";
import PersonalInfoForm from "@/components/forms/resume/PersonalInfoForm";
import { TemplateForm } from "@/components/forms/resume/TemplateForm";

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
    title: "Template",
    component: TemplateForm,
    key: "template",
  },
  {
    title: "Personal info",
    component: PersonalInfoForm,
    key: "personal-info",
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
    component: CertificationsForm,
    key: "certifications",
  },
  {
    title: "References",
    component: RefrencesForm,
    key: "references",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
];
