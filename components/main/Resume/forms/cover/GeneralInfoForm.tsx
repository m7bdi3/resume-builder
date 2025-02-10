import {
  coverGeneralInfoSchema,
  type CoverGeneralInfoValues,
} from "@/lib/validation";
import type { CoverEditorFormProps } from "@/lib/types";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { useCoverForm } from "@/hooks/useCoverForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const GeneralInfoForm = ({
  coverData,
  setCoverData,
  resumeData,
}: CoverEditorFormProps) => {
  const form = useCoverForm<CoverGeneralInfoValues>(
    coverGeneralInfoSchema,
    {
      title: coverData.title ?? "",
      jobDescription: coverData.jobDescription ?? "",
    },
    { coverData, setCoverData, resumeData }
  );

  return (
    <ResumeFormWrapper
      title="General Info"
      description="This will not appear on your cover letter."
      form={form}
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="My cool resume" autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Your next job description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ResumeFormWrapper>
  );
};
