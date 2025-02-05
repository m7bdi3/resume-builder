import { generalInfoSchema, type GeneralInfoValues } from "@/lib/validation";
import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { RepeatedFormField } from "@/components/main/Resume/forms/RepeatedFormField";
import { generalInfofieldsConfig } from "@/lib/forms";

export const GeneralInfoForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useResumeForm<GeneralInfoValues>(
    generalInfoSchema,
    {
      title: resumeData.title ?? "",
      description: resumeData.description ?? "",
      jobDescription: resumeData.jobDescription ?? "",
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="General Info"
      description="This will not appear on your resume."
      form={form}
    >
      {generalInfofieldsConfig.map((config) => {
        return <RepeatedFormField key={config.name} form={form} {...config} />;
      })}
    </ResumeFormWrapper>
  );
};
