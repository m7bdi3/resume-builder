import type { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import { SectionHeader } from "@/components/main/Resume/ResumePreview/SectionHeader";
import Link from "next/link";

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
    <section className="mb-8">
      <SectionHeader title="Projects" colorHex={colorHex} />
      <div className="space-y-6">
        {projectsNotEmpty.map((pro, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-grow flex items-center gap-2">
                <h3 className="font-semibold " style={{ color: colorHex }}>
                  {pro.title}
                </h3>
                {pro.link && (
                  <Link
                    href={pro.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span className="text-gray-400">|</span> Github
                  </Link>
                )}
              </div>
              {pro.startDate && (
                <span className="text-sm font-medium text-gray-600 mt-1 sm:mt-0 whitespace-nowrap">
                  {formatDate(new Date(pro.startDate), "MMM yyyy")}
                  {pro.endDate &&
                    ` - ${formatDate(new Date(pro.endDate), "MMM yyyy")}`}
                </span>
              )}
            </div>
            {pro.description && (
              <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
                {pro.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
