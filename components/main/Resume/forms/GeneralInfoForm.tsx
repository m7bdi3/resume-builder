import { generalInfoSchema, type GeneralInfoValues } from "@/lib/validation";
import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";

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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input {...field} placeholder="A resume for my next job." />
            </FormControl>
            <FormDescription>Describe what this resume is for.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </ResumeFormWrapper>
  );
};
