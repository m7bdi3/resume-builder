import { ResumeValues } from "@/lib/validation";
import { PersonalInfoHeader } from "../PersonalInfoHeader";
import { SummarySection } from "../SummarySection";
import { WorkExperienceSection } from "../WorkExperienceSection";
import { EducationSection } from "../EducationSection";
import { SkillsSection } from "../SkillsSection";
import { ProjectsSection } from "../ProjectsSection";
import { CertificationsSection } from "../CertificatesSection";
import { ReferenceSection } from "../ReferenceSection";
import { AdditionalSection } from "../AdditionalSection";

interface Props {
  resumeData: ResumeValues;
  className?: string;
}
export default function ModernAsymmetric({ resumeData }: Props) {
  return (
    <div className=" text-sm">
      <div
        className="h-32"
        style={{
          backgroundColor: `${resumeData?.colorHex}45` || "var(--primary)",
        }}
      />
      <div className="px-8 -mt-16">
        <div
          className="p-6 mb-6 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}` || "var(--primary)",
          }}
        >
          <PersonalInfoHeader resumeData={resumeData} />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <SummarySection resumeData={resumeData} />
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <ProjectsSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <div
              className="p-4"
              style={{
                backgroundColor:
                  `${resumeData?.colorHex}45` || "var(--primary)",
              }}
            >
              <SkillsSection resumeData={resumeData} />
            </div>
            <div
              className="p-4"
              style={{
                backgroundColor:
                  `${resumeData?.colorHex}45` || "var(--primary)",
              }}
            >
              <CertificationsSection resumeData={resumeData} />
            </div>
            <div
              className="p-4"
              style={{
                backgroundColor:
                  `${resumeData?.colorHex}45` || "var(--primary)",
              }}
            >
              <ReferenceSection resumeData={resumeData} />
            </div>
            <div
              className="p-4"
              style={{
                backgroundColor:
                  `${resumeData?.colorHex}45` || "var(--primary)",
              }}
            >
              <AdditionalSection resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
