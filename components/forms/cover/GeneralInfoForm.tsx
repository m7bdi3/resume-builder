import {
  coverGeneralInfoSchema,
  type CoverGeneralInfoValues,
} from "@/lib/validation";
import type { CoverEditorFormProps } from "@/lib/types";
import { useCoverForm } from "@/hooks/useCoverForm";
import {
  Form,
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
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General info</h2>
        <p className="text-sm text-muted-foreground">
          This will not appear on your resume.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
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
                  <Textarea
                    {...field}
                    placeholder="Your next job description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
