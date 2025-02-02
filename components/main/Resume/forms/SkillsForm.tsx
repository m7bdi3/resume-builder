import { useResumeForm } from "@/hooks/useResumeForm";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsSchemaValues } from "@/lib/validation";
import { skillsfieldsConfig } from "@/lib/forms";

import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { RepeatedFormField } from "@/components/main/Resume/forms/RepeatedFormField";

export const SkillsForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const form = useResumeForm<SkillsSchemaValues>(
    skillsSchema,
    {
      skills: resumeData.skills ?? [],
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="Skills"
      description="What are you good at?"
      form={form}
    >
      {skillsfieldsConfig.map((config) => {
        return <RepeatedFormField key={config.name} form={form} {...config} />;
      })}
    </ResumeFormWrapper>
  );
};
