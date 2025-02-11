import { Badge } from "@/components/ui/badge";
import type { ResumeSectionProps } from "@/lib/types";
import { BorderStyles } from "@/components/main/Resume/BorderStyleButton";
import { SectionHeader } from "@/components/main/Resume/ResumePreview/SectionHeader";

export const AdditionalSection: React.FC<ResumeSectionProps> = ({
  resumeData,
}) => {
  const { hobbies, achievements, languages, colorHex, borderStyle } =
    resumeData;

  const hasAchievements = (achievements ?? []).length > 0;
  const hasLanguages = (languages ?? []).length > 0;
  const hasHobbies = (hobbies ?? []).length > 0;

  if (!hasAchievements && !hasLanguages && !hasHobbies) return null;

  return (
    <section className="mb-8">
      <div className="break-inside-avoid space-y-6">
        {hasAchievements && (
          <div>
            <SectionHeader title="Achievements" colorHex={colorHex} />
            <ul className="mt-3 space-y-2">
              {achievements?.map((achievement, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-xl" style={{ color: colorHex }}>
                    •
                  </span>
                  <span className="text-sm text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasLanguages && (
          <div>
            <SectionHeader title="Languages" colorHex={colorHex} />
            <div className="flex flex-wrap gap-2 mt-3">
              {languages?.map((language, index) => (
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
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hasHobbies && (
          <div>
            <SectionHeader title="Hobbies" colorHex={colorHex} />
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {hobbies?.map((hobby, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 flex items-center"
                >
                  <span className="mr-2 text-xl" style={{ color: colorHex }}>
                    •
                  </span>
                  {hobby}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
