import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { personalInfoSchema, type PersonalInfoValues } from "@/lib/validation";

import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";
import { RepeatedFormField } from "./RepeatedFormField";

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

  return (
    <ResumeFormWrapper
      title="Personal Info"
      description="Tell us about yourself."
      form={form}
    >
      <RepeatedFormField
        img
        name="img"
        form={form}
        label="Your Photo"
        type="file"
        accept="image/*"
        inputType="input"
        autoFocus={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <RepeatedFormField
          name="firstName"
          form={form}
          label="First name"
          inputType="input"
          placeholder="John"
          autoFocus
        />
        <RepeatedFormField
          name="lastName"
          form={form}
          label="Last name"
          inputType="input"
          placeholder="Doe"
          autoFocus={false}
        />
      </div>
      <RepeatedFormField
        name="jobTitle"
        form={form}
        label="Job title"
        inputType="input"
        autoFocus={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <RepeatedFormField
          name="city"
          form={form}
          label="City"
          inputType="input"
          autoFocus={false}
        />
        <RepeatedFormField
          name="country"
          form={form}
          label="Country"
          inputType="input"
          autoFocus={false}
        />
      </div>
      <RepeatedFormField
        name="phone"
        form={form}
        label="Phone"
        inputType="input"
        autoFocus={false}
        type="tel"
      />
      <RepeatedFormField
        name="email"
        form={form}
        label="Email"
        inputType="input"
        placeholder="example@email.com"
        autoFocus={false}
        type="email"
      />
    </ResumeFormWrapper>
  );
};
