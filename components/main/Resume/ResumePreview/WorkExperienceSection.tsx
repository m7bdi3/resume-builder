import { formatDate } from "date-fns";
import type { ResumeSectionProps } from "@/lib/types";
import { SectionHeader } from "@/components/main/Resume/ResumePreview/SectionHeader";

export const WorkExperienceSection = ({ resumeData }: ResumeSectionProps) => {
  const { workExperience, colorHex } = resumeData;

  const workExperienceNotEmpty = workExperience?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!workExperienceNotEmpty?.length) return null;

  return (
    <section className="mb-8">
      <SectionHeader title="Work Experience" colorHex={colorHex} />
      <div className="space-y-6">
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <h3 className="font-semibold" style={{ color: colorHex }}>
                  {exp.position}
                </h3>
                <p className="text-sm font-medium text-gray-700 ml-2">
                  <span className="text-gray-400">|</span> {exp.company}
                </p>
              </div>
              {exp.startDate && (
                <span className="text-sm font-medium text-gray-600 mt-1 sm:mt-0">
                  {formatDate(new Date(exp.startDate), "MMM yyyy")} -{" "}
                  {exp.endDate
                    ? formatDate(new Date(exp.endDate), "MMM yyyy")
                    : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-700 whitespace-pre-line mt-2">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
