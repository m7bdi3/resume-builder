import React from "react";
import { useResumeForm } from "@/hooks/useResumeForm";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsSchemaValues } from "@/lib/validation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ResumeFormWrapper } from "./ResumeFormWrapper";

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
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Skills</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                autoFocus
                placeholder="e.g react.js, node.js, graphic design, ..."
                onChange={(e) => {
                  const skills = e.target.value.split(",");
                  field.onChange(skills);
                }}
              />
            </FormControl>
            <FormDescription>Separate each skill with a comma</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </ResumeFormWrapper>
  );
};
