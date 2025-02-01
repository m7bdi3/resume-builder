import { generalInfoSchema, type GeneralInfoValues } from "@/lib/validation";
import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { RepeatedFormField } from "./RepeatedFormField";

export const GeneralInfoForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useResumeForm<GeneralInfoValues>(
    generalInfoSchema,
    {
      title: resumeData.title || "",
      description: resumeData.description || "",
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="General Info"
      description="This will not appear on your resume."
      form={form}
    >
      <RepeatedFormField
        name="title"
        form={form}
        label="Project name"
        inputType="input"
        placeholder="My cool resume"
        autoFocus
      />
      <RepeatedFormField
        name="description"
        form={form}
        label="Description"
        inputType="input"
        placeholder="A resume for my next job."
        autoFocus
        description="Describe what this resume is for."
      />
    </ResumeFormWrapper>
  );
};
