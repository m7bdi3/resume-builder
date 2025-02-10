import type { CoverEditorFormProps } from "@/lib/types";
import {
  personalInfoSchema,
  type CoverPersonalInfoValues,
} from "@/lib/validation";

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
import { GenerateCoverButton } from "../ai/GenerateCoverButton";

export const PersonalInfoForm = ({
  coverData,
  setCoverData,
}: CoverEditorFormProps) => {
  const form = useCoverForm<CoverPersonalInfoValues>(
    personalInfoSchema,
    {
      firstName: coverData.firstName ?? "",
      lastName: coverData.lastName ?? "",
      jobTitle: coverData.jobTitle ?? "",
      phone: coverData.phone ?? "",
      email: coverData.email ?? "",
      body: coverData.body ?? "",
    },
    { coverData, setCoverData }
  );

  return (
    <ResumeFormWrapper
      title="Personal Info"
      description="Tell us about yourself."
      form={form}
    >
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input {...field} type="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <GenerateCoverButton
        coverData={coverData}
        onGenerated={(body) => form.setValue("body", body)}
      />
    </ResumeFormWrapper>
  );
};
