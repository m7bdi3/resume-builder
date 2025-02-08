import { Badge } from "@/components/ui/badge";
import { ResumeSectionProps } from "@/lib/types";
import { BorderStyles } from "../BorderStyleButton";
import { SectionHeader } from "./SectionHeader";

export const SkillsSection = ({ resumeData }: ResumeSectionProps) => {
  const { softSkills, technicalSkills, colorHex, borderStyle } = resumeData;

  const skill1 = (technicalSkills ?? []).length > 0 ? technicalSkills : null;

  const skill2 = (softSkills ?? []).length > 0 ? softSkills : null;

  return (
    <section className="mb-4">
      <div className="break-inside-avoid space-y-3">
        {skill1 && (
          <>
            <SectionHeader title="Technical Skills" colorHex={colorHex} />
            <div className="flex flex-wrap gap-2 print:gap-1">
              {technicalSkills?.map((skill, index) => (
                <Badge
                  key={index}
                  className="text-white"
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
          </>
        )}

        {skill2 && (
          <>
            <SectionHeader title="Soft Skills" colorHex={colorHex} />

            <div className="flex flex-wrap gap-2 print:gap-1">
              {softSkills?.map((skill, index) => (
                <Badge
                  key={index}
                  className="text-white"
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
          </>
        )}
      </div>
    </section>
  );
};
