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
    <section className="mb-4">
      <SectionHeader title="Education" colorHex={colorHex} />
      <div className="space-y-4">
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-start">
              <div className="">
                <p
                  className="font-semibold text-base"
                  style={{ color: colorHex }}
                >
                  • {edu.degree}
                </p>
                <p className="text-sm ml-1">{edu.school}</p>
              </div>
              {edu.startDate && (
                <span className="text-sm text-gray-600">
                  {formatDate(edu.startDate, "MM/yyyy")}
                  {edu.endDate && ` - ${formatDate(edu.endDate, "MM/yyyy")}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
