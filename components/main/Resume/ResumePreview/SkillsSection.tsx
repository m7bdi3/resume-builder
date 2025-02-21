import { Badge } from "@/components/ui/badge";
import type { ResumeSectionProps } from "@/lib/types";
import { BorderStyles } from "@/components/main/Resume/BorderStyleButton";
import { SectionHeader } from "@/components/main/Resume/ResumePreview/SectionHeader";

export const SkillsSection: React.FC<ResumeSectionProps> = ({ resumeData }) => {
  const { softSkills, technicalSkills, colorHex, borderStyle } = resumeData;

  const hasTechnicalSkills = (technicalSkills ?? []).length > 0;
  const hasSoftSkills = (softSkills ?? []).length > 0;

  if (!hasTechnicalSkills && !hasSoftSkills) return null;

  return (
    <section className="mb-8">
      <div className="break-inside-avoid space-y-6">
        {hasTechnicalSkills && (
          <div>
            <SectionHeader title="Technical Skills" colorHex={colorHex} />
            <div className="flex flex-wrap gap-2 mt-3">
              {technicalSkills?.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm font-medium py-1 px-3"
                  style={{
                    backgroundColor: `${colorHex}20`,
                    color: colorHex,
                    borderRadius:
                      borderStyle === BorderStyles.SQUARE
                        ? "0px"
                        : borderStyle === BorderStyles.CIRCLE
                          ? "99999px"
                          : "6px",
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hasSoftSkills && (
          <div>
            <SectionHeader title="Soft Skills" colorHex={colorHex} />
            <div className="flex flex-wrap gap-2 mt-3">
              {softSkills?.map((skill, index) => (
                <Badge
                  key={index}
                 variant="secondary"
                  className="text-sm font-medium py-1 px-3"
                  style={{
                    borderColor: colorHex,
                    color: colorHex,
                    borderRadius:
                      borderStyle === BorderStyles.SQUARE
                        ? "0px"
                        : borderStyle === BorderStyles.CIRCLE
                          ? "99999px"
                          : "6px",
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
