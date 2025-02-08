import type React from "react";
import type { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import { SectionHeader } from "./SectionHeader";

interface Props {
  resumeData: ResumeValues;
}

export const ProjectsSection: React.FC<Props> = ({ resumeData }) => {
  const { projects, colorHex } = resumeData;

  const projectsNotEmpty = projects?.filter(
    (pro) => Object.values(pro).filter(Boolean).length > 0
  );

  if (!projectsNotEmpty?.length) return null;

  return (
    <section className="mb-4">
      <SectionHeader title="Projects" colorHex={colorHex} />
      <div className="space-y-4">
        {projectsNotEmpty.map((pro, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-start">
              <div className="">
                <p
                  className="font-semibold text-base"
                  style={{ color: colorHex }}
                >
                  • {pro.title}
                </p>
                <p className="text-sm ml-1">{pro.link}</p>
                <p className="text-sm ml-1">{pro.description}</p>
              </div>
              {pro.startDate && (
                <span className="text-sm text-gray-600">
                  {formatDate(pro.startDate, "MM/yyyy")}
                  {pro.endDate && ` - ${formatDate(pro.endDate, "MM/yyyy")}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
