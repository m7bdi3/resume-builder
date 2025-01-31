import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "../ui/badge";
import { BorderStyles } from "./BorderStyleButton";
interface Props {
  resumeData: ResumeValues;
  className?: string;
}

export const ResumePreview = ({ resumeData, className }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
};

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

const PersonalInfoHeader = ({ resumeData }: ResumeSectionProps) => {
  const {
    firstName,
    lastName,
    img,
    jobTitle,
    country,
    city,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;

  const [imgSrc, setImgSrc] = useState(img instanceof File ? "" : img);

  useEffect(() => {
    const objectUrl = img instanceof File ? URL.createObjectURL(img) : "";
    if (objectUrl) setImgSrc(objectUrl);
    if (img === null) setImgSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [img]);

  return (
    <div className="flex items-center gap-6">
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={firstName || "Author photo"}
          width={100}
          height={100}
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "99999px"
                  : "10%",
          }}
          className="aspect-square object-cover"
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold"
            style={{
              color: colorHex,
            }}
          >
            {firstName} {lastName}
          </p>
          <p
            className="font-medium"
            style={{
              color: colorHex,
            }}
          >
            {jobTitle}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {city}
          {city && country ? "," : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
};

const SummarySection = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3 break-inside-avoid">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Professional profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
};

const WorkExperienceSection = ({ resumeData }: ResumeSectionProps) => {
  const { workExperience, colorHex } = resumeData;

  const workExperienceNotEmpty = workExperience?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!workExperienceNotEmpty?.length) return null;
  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3 ">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Work experience
        </p>
        <div className="whitespace-pre-line text-sm">
          {workExperienceNotEmpty.map((exp, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between font-semibold"
                style={{
                  color: colorHex,
                }}
              >
                <span>{exp.position}</span>
                {exp.startDate && (
                  <span>
                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MM/yyyy")
                      : "Present"}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold">{exp.company}</p>
              <div className="whitespace-pre-line text-xs">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const EducationSection = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );

  if (!educationsNotEmpty?.length) return null;
  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3 ">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
        <div className="whitespace-pre-line text-sm">
          {educationsNotEmpty.map((edu, index) => (
            <div
              key={index}
              className="break-inside-avoid space-y-1"
              style={{
                color: colorHex,
              }}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{edu.degree}</span>
                {edu.startDate &&
                  `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
              </div>
              <p className="text-xs font-semibold">{edu.school}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SkillsSection = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-black hover:bg-black text-white rounded-md"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                      ? "99999px"
                      : "8px",
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};
