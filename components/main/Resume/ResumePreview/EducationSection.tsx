import type React from "react";
import type { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import { SectionHeader } from "./SectionHeader";

interface Props {
  resumeData: ResumeValues;
}

export const EducationSection: React.FC<Props> = ({ resumeData }) => {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <>
      <SectionHeader title="Education" colorHex={colorHex} />
      <div className="space-y-3">
        {educationsNotEmpty.map((edu, index) => (
          <div
            key={index}
            className="break-inside-avoid space-y-1"
            style={{ color: colorHex }}
          >
            <div className="flex items-center justify-between font-semibold">
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {formatDate(edu.startDate, "MM/yyyy")}
                  {edu.endDate && ` - ${formatDate(edu.endDate, "MM/yyyy")}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
};
