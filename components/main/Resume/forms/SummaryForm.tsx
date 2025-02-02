import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { summarySchema, type SummarySchemaValues } from "@/lib/validation";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { RepeatedFormField } from "@/components/main/Resume/forms/RepeatedFormField";
import { summaryfieldsConfig } from "@/lib/forms";

export const SummaryForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const form = useResumeForm<SummarySchemaValues>(
    summarySchema,
    {
      summary: resumeData.summary ?? "",
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="Professional Summary"
      description="What are you good at?"
      form={form}
    >
      {summaryfieldsConfig.map((config) => {
        return <RepeatedFormField key={config.name} form={form} {...config} />;
      })}
    </ResumeFormWrapper>
  );
};
