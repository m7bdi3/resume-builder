"use client";

import {
  coverGeneralInfoSchema,
  ResumeValues,
  type CoverGeneralInfoValues,
} from "@/lib/validation";
import type { CoverEditorFormProps, ResumeServerData } from "@/lib/types";
import { useCoverForm } from "@/hooks/useCoverForm";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GenerateCoverButton } from "../ai/GenerateCoverButton";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { mapToResumeValues } from "@/lib/utils";

export const GeneralInfoForm = ({
  coverData,
  setCoverData,
}: CoverEditorFormProps) => {
  const { resumes } = useResumeStore();
  const [selectedResume, setSelectedResume] = useState<
    ResumeServerData | undefined
  >(undefined);

  const form = useCoverForm<CoverGeneralInfoValues>(
    coverGeneralInfoSchema,
    {
      title: coverData.title ?? "",
      jobDescription: coverData.jobDescription ?? "",
      body: coverData.body ?? "",
      resumeId: coverData.resumeId ?? "",
    },
    { coverData, setCoverData }
  );

  const resumeId = form.watch("resumeId");
  useEffect(() => {
    const resume = resumes.find((r) => r.id === resumeId);
    setSelectedResume(resume);
  }, [resumeId, resumes]);

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
          <FormField
            control={form.control}
            name="resumeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a resume</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resume" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.title} - Created:{" "}
                        {format(new Date(resume.createdAt), "MMM d, yyyy")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose a resume to automatically incorporate its details into
                  your AI-generated cover letter. If you&apos;d prefer a generic
                  cover letter, simply leave this field blank.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <GenerateCoverButton
            coverData={coverData}
            resumeData={
              selectedResume
                ? mapToResumeValues(selectedResume)
                : ({} as ResumeValues)
            }
            onGenerated={(body) => form.setValue("body", body)}
          />
        </form>
      </Form>
    </div>
  );
};
