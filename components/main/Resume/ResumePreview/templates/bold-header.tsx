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
}
export default function BoldHeader({ resumeData }: Props) {
  return (
    <>
      <div
        className="p-6"
        style={{
          backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
        }}
      >
        <PersonalInfoHeader resumeData={resumeData} />
      </div>
      <div className="p-6 space-y-6">
        <div
          className="p-4 rounded border"
          style={{
            backgroundColor: `${resumeData?.colorHex}15` || "#f8f9fa",
          }}
        >
          <SummarySection resumeData={resumeData} />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-6 col-span-2">
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <ProjectsSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <SkillsSection resumeData={resumeData} />
            <CertificationsSection resumeData={resumeData} />
            <ReferenceSection resumeData={resumeData} />
            <AdditionalSection resumeData={resumeData} />
          </div>
        </div>
      </div>
    </>
  );
}
