import type { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import { SectionHeader } from "@/components/main/Resume/ResumePreview/SectionHeader";

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
    <section className="mb-8">
      <SectionHeader title="Education" colorHex={colorHex} />
      <div className="space-y-3">
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-gray-400">|</span>{" "}
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {edu.school}
                </p>
              </div>
              {edu.startDate && (
                <span className="text-sm font-medium text-gray-600 mt-1">
                  {formatDate(new Date(edu.startDate), "MMM yyyy")}
                  {edu.endDate &&
                    ` - ${formatDate(new Date(edu.endDate), "MMM yyyy")}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
