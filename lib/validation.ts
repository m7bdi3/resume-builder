import * as z from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
  jobDescription: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  img: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file."
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4mb."
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  linkedInUrl: optionalString,
  githubUrl: optionalString,
  websiteUrl: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const additionalInfoSchema = z.object({
  hobbies: z.array(z.string().trim()).optional(),
  achievements: z.array(z.string().trim()).optional(),
  languages: z.array(z.string().trim()).optional(),
});

export type AdditionalInfoValues = z.infer<typeof additionalInfoSchema>;

export const workExperienceSchema = z.object({
  workExperience: z
    .array(
      z.object({
        id: optionalString,
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperience"]
>[number];

export const projectsSchema = z.object({
  projects: z
    .array(
      z.object({
        id: optionalString,
        title: optionalString,
        description: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        link: optionalString,
      })
    )
    .optional(),
});

export type ProjectsValues = z.infer<typeof projectsSchema>;

export type Projects = NonNullable<
  z.infer<typeof projectsSchema>["projects"]
>[number];

export const referencesSchema = z.object({
  references: z
    .array(
      z.object({
        name: optionalString,
        phone: optionalString,
        email: optionalString,
      })
    )
    .optional(),
});

export type ReferencesValues = z.infer<typeof referencesSchema>;

export type References = NonNullable<
  z.infer<typeof referencesSchema>["references"]
>[number];

export const certificationsSchema = z.object({
  certifications: z
    .array(
      z.object({
        name: optionalString,
        issuer: optionalString,
        dateObtained: optionalString,
        credentialId: optionalString,
      })
    )
    .optional(),
});

export type CertificationsValues = z.infer<typeof certificationsSchema>;

export type Certifications = NonNullable<
  z.infer<typeof certificationsSchema>["certifications"]
>[number];

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      })
    )
    .optional(),
});

export type EducationSchemaValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  softSkills: z.array(z.string().trim()).optional(),
  technicalSkills: z.array(z.string().trim()).optional(),
});

export type SkillsSchemaValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummarySchemaValues = z.infer<typeof summarySchema>;

export const JobDescriptionSchema = z.object({
  jobDescription: optionalString,
});

export type JobDescriptionValues = z.infer<typeof JobDescriptionSchema>;

export const coverLetterSchema = z.object({
  id: optionalString,
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  phone: optionalString,
  email: optionalString,
  jobDescription: optionalString,
  title: optionalString,
  body: optionalString,
});

export type CoverLetterValues = z.infer<typeof coverLetterSchema>;

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...additionalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  ...JobDescriptionSchema.shape,
  ...projectsSchema.shape,
  ...referencesSchema.shape,
  ...certificationsSchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "img"> & {
  id?: string;
  img?: File | string | null;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least characters "),
  ...JobDescriptionSchema.shape,
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...JobDescriptionSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

export const generateSKillsSchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...JobDescriptionSchema.shape,
});

export type GenerateSkillsInput = z.infer<typeof generateSKillsSchema>;

export const coverStep1Schema = z.object({
  choice: z.enum(["new", "existing"]).default("new"),
});

export type CoverStep1Values = z.infer<typeof coverStep1Schema>;

export const coverGeneralInfoSchema = z.object({
  jobDescription: optionalString,
  title: optionalString,
  body: optionalString,
});

export type CoverGeneralInfoValues = z.infer<typeof coverGeneralInfoSchema>;

export const coverPersonalInfoSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  phone: optionalString,
  email: optionalString,
});

export type CoverPersonalInfoValues = z.infer<typeof coverPersonalInfoSchema>;

export const generateCoverSchema = z.object({
  ...coverLetterSchema.shape,
});

export type GenerateCoverInput = z.infer<typeof generateCoverSchema>;
