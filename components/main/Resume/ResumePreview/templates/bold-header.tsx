import { Card } from "@/components/ui/card";
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
export default function BoldHeader({ resumeData }: Props) {
  return (
    <div className=" text-sm">
      <div
        className="bg-primary p-8 text-primary-foreground"
        style={{
          backgroundColor: `${resumeData?.colorHex}25` || "#f8f9fa",
        }}
      >
        <PersonalInfoHeader resumeData={resumeData} />
      </div>
      <div className="p-8 space-y-6">
        <Card
          className="p-4"
          style={{
            backgroundColor: `${resumeData?.colorHex}15` || "#f8f9fa",
          }}
        >
          <SummarySection resumeData={resumeData} />
        </Card>
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
    </div>
  );
}
