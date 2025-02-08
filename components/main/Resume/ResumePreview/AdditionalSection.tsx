import { Badge } from "@/components/ui/badge";
import { ResumeSectionProps } from "@/lib/types";
import { BorderStyles } from "../BorderStyleButton";
import { SectionHeader } from "./SectionHeader";

export const AdditionalSection = ({ resumeData }: ResumeSectionProps) => {
  const { hobbies, achievements, languages, colorHex, borderStyle } =
    resumeData;

  const skill1 = (hobbies ?? []).length > 0 ? hobbies : null;

  const skill2 = (achievements ?? []).length > 0 ? achievements : null;

  const skill3 = (languages ?? []).length > 0 ? languages : null;

  return (
    <section className="mb-4">
      <div className="break-inside-avoid space-y-3">
        {skill1 && (
          <>
            <SectionHeader title="Achievements" colorHex={colorHex} />
            <ul className="flex flex-wrap gap-2 print:gap-1">
              {achievements?.map((skill, index) => (
                <li key={index}>- {skill}</li>
              ))}
            </ul>
          </>
        )}

        {skill3 && (
          <>
            <SectionHeader title="Languages" colorHex={colorHex} />

            <div className="flex flex-wrap gap-2 print:gap-1">
              {languages?.map((skill, index) => (
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
            <SectionHeader title="Hobbies" colorHex={colorHex} />

            <ul className="flex flex-wrap gap-2 print:gap-1">
              {hobbies?.map((skill, index) => (
                <li key={index} className="font-semibold">
                  - {skill}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};
