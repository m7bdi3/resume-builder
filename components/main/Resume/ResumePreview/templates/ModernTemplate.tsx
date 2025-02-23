import { ResumeValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { PersonalInfoHeader } from "../PersonalInfoHeader";
import { SummarySection } from "../SummarySection";
import { WorkExperienceSection } from "../WorkExperienceSection";
import { EducationSection } from "../EducationSection";
import { SkillsSection } from "../SkillsSection";
import { AdditionalSection } from "../AdditionalSection";
import { ProjectsSection } from "../ProjectsSection";
import { CertificationsSection } from "../CertificatesSection";
import { ReferenceSection } from "../ReferenceSection";

interface Props {
  resumeData: ResumeValues;
  className?: string;
}

export const ModernTemplate = ({ resumeData, className }: Props) => {
  return (
    <div
      className={cn("grid grid-cols-3 gap-2 p-6", className)}
      id="resumePreviewContent"
    >
      <div
        className="col-span-1 space-y-6 p-4 h-fit rounded-lg"
        style={{
          backgroundColor: `${resumeData.colorHex}20` || "",
        }}
      >
        <PersonalInfoHeader resumeData={resumeData || {}} />
        <SkillsSection resumeData={resumeData || {}} />
        <CertificationsSection resumeData={resumeData || {}} />
        <ReferenceSection resumeData={resumeData || {}} />
      </div>
      <div className="col-span-2 space-y-6 pl-4">
        <SummarySection resumeData={resumeData || {}} />
        <WorkExperienceSection resumeData={resumeData || {}} />
        <EducationSection resumeData={resumeData || {}} />
        <ProjectsSection resumeData={resumeData || {}} />
        <AdditionalSection resumeData={resumeData || {}} />
      </div>
    </div>
  );
};
