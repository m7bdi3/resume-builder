import { CoverEditorFormProps } from "@/lib/types";
import { PersonalInfoForm } from "@/components/forms/cover/PersonalInfoForm";
import { GeneralInfoForm } from "@/components/forms/cover/GeneralInfoForm";

export const Coversteps: {
  title: string;
  component: React.ComponentType<CoverEditorFormProps>;
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
];
