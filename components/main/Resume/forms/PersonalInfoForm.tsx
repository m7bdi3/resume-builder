import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { personalInfoSchema, type PersonalInfoValues } from "@/lib/validation";
import { personalInfofieldsConfig } from "@/lib/forms";

import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import {
  RenderFieldGroup,
  RepeatedFormField,
} from "@/components/main/Resume/forms/RepeatedFormField";

export const PersonalInfoForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useResumeForm<PersonalInfoValues>(
    personalInfoSchema,
    {
      firstName: resumeData.firstName ?? "",
      lastName: resumeData.lastName ?? "",
      jobTitle: resumeData.jobTitle ?? "",
      city: resumeData.city ?? "",
      country: resumeData.country ?? "",
      phone: resumeData.phone ?? "",
      email: resumeData.email ?? "",
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="Personal Info"
      description="Tell us about yourself."
      form={form}
    >
      {personalInfofieldsConfig.map((config) => {
        if (Array.isArray(config)) {
          const groupKey = config.map((field) => field.name).join("_");
          return (
            <RenderFieldGroup
              form={form}
              group={config}
              index={groupKey}
              key={groupKey}
            />
          );
        }
        return <RepeatedFormField key={config.name} form={form} {...config} />;
      })}
    </ResumeFormWrapper>
  );
};
