import { HTMLInputTypeAttribute } from "react";
import { ResumeValues } from "./validation";

export type FieldConfig = {
  index?: number;
  group?: boolean;
  name: keyof ResumeValues;
  label: string;
  placeholder?: string;
  autoFocus: boolean;
  inputType: "input" | "textarea";
  description?: string;
  type?: HTMLInputTypeAttribute;
  img?: boolean;
  accept?: string;
  onSkillChange?: boolean;
  isDate?: boolean;
  hasButton?: boolean;
};

export const personalInfofieldsConfig: (FieldConfig | FieldConfig[])[] = [
  // Image field (special case)
  {
    name: "img",
    label: "Your Photo",
    inputType: "input",
    type: "file",
    img: true,
    accept: "image/*",
    autoFocus: false,
  },
  [
    {
      name: "firstName",
      label: "First name",
      inputType: "input",
      placeholder: "John",
      autoFocus: true,
    },
    {
      name: "lastName",
      label: "Last name",
      inputType: "input",
      placeholder: "Doe",
      autoFocus: false,
    },
  ],

  {
    name: "jobTitle",
    label: "Job title",
    inputType: "input",
    autoFocus: false,
  },
  [
    { name: "city", label: "City", inputType: "input", autoFocus: false },
    { name: "country", label: "Country", inputType: "input", autoFocus: false },
  ],
  {
    name: "phone",
    label: "Phone",
    inputType: "input",
    type: "tel",
    autoFocus: false,
  },
  {
    name: "email",
    label: "Email",
    inputType: "input",
    type: "email",
    placeholder: "example@email.com",
    autoFocus: false,
  },
];

export const generalInfofieldsConfig: FieldConfig[] = [
  {
    name: "title",
    label: "Project name",
    inputType: "input",
    placeholder: "My cool resume",
    autoFocus: true,
  },
  {
    name: "description",
    label: "Description",
    inputType: "input",
    placeholder: "A resume for my next job.",
    autoFocus: false,
    description: "Describe what this resume is for.",
  },
];

export const skillsfieldsConfig: FieldConfig[] = [
  {
    name: "skills",
    label: "Skills",
    inputType: "textarea",
    placeholder: "e.g react.js, node.js, graphic design, ...",
    autoFocus: true,
    onSkillChange: true,
    description: "Separate each skill with a comma",
  },
];

export const summaryfieldsConfig: FieldConfig[] = [
  {
    name: "summary",
    label: "Professional Summary",
    inputType: "textarea",
    placeholder: "A brief, engaging text about yourself",
    autoFocus: true,
    hasButton: true,
  },
];
