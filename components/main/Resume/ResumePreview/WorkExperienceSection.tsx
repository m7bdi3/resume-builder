import { formatDate } from "date-fns";
import { ResumeSectionProps } from "@/lib/types";

export const WorkExperienceSection = ({ resumeData }: ResumeSectionProps) => {
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
