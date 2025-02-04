import { Badge } from "@/components/ui/badge";
import { ResumeSectionProps } from "@/lib/types";
import { BorderStyles } from "../BorderStyleButton";
import { SectionHeader } from "./SectionHeader";

export const SkillsSection = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <section className="mb-4">
      <SectionHeader title="Skills" colorHex={colorHex} />
      <div className="break-inside-avoid space-y-3">
        <div className="flex flex-wrap gap-2 print:gap-1">
          {skills.map((skill, index) => (
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
      </div>
    </section>
  );
};
