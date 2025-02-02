import { formatDate } from "date-fns";
import { ResumeSectionProps } from "@/lib/types";
import { SectionHeader } from "./SectionHeader";

export const WorkExperienceSection = ({ resumeData }: ResumeSectionProps) => {
  const { workExperience, colorHex } = resumeData;

  const workExperienceNotEmpty = workExperience?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!workExperienceNotEmpty?.length) return null;
  return (
    <section className="mb-4">
      <SectionHeader title="Work Experience" colorHex={colorHex} />
      <div className="space-y-4">
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center">
                <p
                  className="font-semibold text-base"
                  style={{ color: colorHex }}
                >
                  • {exp.position}
                </p>
                <p className="text-sm font-medium ml-1">
                  <span className="text-muted-foreground">|</span> {exp.company}
                </p>
              </div>
              {exp.startDate && (
                <span className="text-sm text-gray-600">
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line ml-1">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
