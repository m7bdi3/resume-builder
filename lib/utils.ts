import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    img: data.imgUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    linkedInUrl: data.linkedInUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    websiteUrl: data.websiteUrl || undefined,
    workExperience: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    softSkills: data.softSkills,
    technicalSkills: data.technicalSkills,
    hobbies: data.hobbies,
    achievements: data.achievements,
    languages: data.languages,

    projects: data.projects.map((pro) => ({
      title: pro.title || undefined,
      link: pro.link || undefined,
      description: pro.description || undefined,
      startDate: pro.startDate?.toISOString().split("T")[0],
      endDate: pro.endDate?.toISOString().split("T")[0],
    })),

    references: data.references.map((ref) => ({
      name: ref.name || undefined,
      phone: ref.phone || undefined,
      email: ref.phone || undefined,
    })),

    certifications: data.certifications.map((cert) => ({
      name: cert.name || undefined,
      issuer: cert.issuer || undefined,
      credentialId: cert.credentialId || undefined,
      dateObtained: cert.dateObtained?.toISOString().split("T")[0],
    })),

    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
