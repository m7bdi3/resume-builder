import { useRef } from "react";
import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { personalInfoSchema, type PersonalInfoValues } from "@/lib/validation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ResumeFormWrapper } from "./ResumeFormWrapper";

export const PersonalInfoForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useResumeForm<PersonalInfoValues>(
    personalInfoSchema,
    {
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
    },
    { resumeData, setResumeData }
  );

  const imgInputRef = useRef<HTMLInputElement>(null);

  return (
    <ResumeFormWrapper
      title="Personal Info"
      description="Tell us about yourself."
      form={form}
    >
      <FormField
        control={form.control}
        name="img"
        render={({ field: { value, ...fieldValues } }) => (
          <FormItem>
            <FormLabel>Your Photo</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...fieldValues}
                  type="file"
                  ref={imgInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    fieldValues.onChange(file);
                  }}
                />
              </FormControl>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => {
                  fieldValues.onChange(null);
                  if (imgInputRef.current) {
                    imgInputRef.current.value = "";
                  }
                }}
              >
                <Trash2 />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" autoFocus />
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
                <Input {...field} placeholder="Doe" />
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
              <Input {...field} placeholder="" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} placeholder="" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} placeholder="" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input {...field} placeholder="" type="tel" />
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
              <Input {...field} placeholder="example@email.com" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ResumeFormWrapper>
  );
};
