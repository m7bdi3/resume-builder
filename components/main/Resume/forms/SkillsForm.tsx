import React from "react";
import { useResumeForm } from "@/hooks/useResumeForm";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsSchemaValues } from "@/lib/validation";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { RepeatedFormField } from "./RepeatedFormField";

export const SkillsForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const form = useResumeForm<SkillsSchemaValues>(
    skillsSchema,
    {
      skills: resumeData.skills || [],
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="Skills"
      description="What are you good at?"
      form={form}
    >
      <RepeatedFormField
        name="skills"
        form={form}
        label="Skills"
        inputType="textarea"
        placeholder="e.g react.js, node.js, graphic design, ..."
        autoFocus
        onSkillChange
        description="Separate each skill with a comma"
      />
    </ResumeFormWrapper>
  );
};
