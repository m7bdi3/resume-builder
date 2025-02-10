import { EditorFormProps } from "@/lib/types";
import { PersonalInfoForm } from "../components/main/Resume/forms/PersonalInfoForm";
import { GeneralInfoForm } from "../components/main/Resume/forms/GeneralInfoForm";
import { SkillsForm } from "../components/main/Resume/forms/SkillsForm";
import WorkExperienceForm from "../components/main/Resume/forms/WorkExperienceForm";
import EducationForm from "../components/main/Resume/forms/EducationForm";
import SummaryForm from "../components/main/Resume/forms/SummaryForm";
import { AdditionalInfoForm } from "../components/main/Resume/forms/AdditionalInfoForm";
import ProjectsForm from "../components/main/Resume/forms/ProjectsForm";
import CertificationsForm from "../components/main/Resume/forms/CertificationsForm";
import RefrencesForm from "../components/main/Resume/forms/RefrenceForm";

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
    component: CertificationsForm,
    key: "certifications",
  },
  {
    title: "References",
    component: RefrencesForm,
    key: "references",
  },
];
