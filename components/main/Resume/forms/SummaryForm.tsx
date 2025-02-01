import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { summarySchema, type SummarySchemaValues } from "@/lib/validation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";

export const SummaryForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const form = useResumeForm<SummarySchemaValues>(
    summarySchema,
    {
      summary: resumeData.summary || "",
    },
    { resumeData, setResumeData }
  );

  return (
    <ResumeFormWrapper
      title="Professional Summary"
      description="What are you good at?"
      form={form}
    >
      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Professional Summary</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                autoFocus
                placeholder="A brief, engaging text about yourself"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ResumeFormWrapper>
  );
};
