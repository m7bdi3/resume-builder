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
export default function ModernAsymmetric({ resumeData }: Props) {
  return (
    <div className="min-h-[297mm] w-[210mm] bg-white text-sm">
      <div className="h-32 bg-primary"></div>
      <div className="px-8 -mt-16">
        <Card className="p-6 mb-6">
          <PersonalInfoHeader resumeData={resumeData} />
        </Card>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <SummarySection resumeData={resumeData} />
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
            <ProjectsSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <Card className="p-4">
              <SkillsSection resumeData={resumeData} />
            </Card>
            <Card className="p-4">
              <CertificationsSection resumeData={resumeData} />
            </Card>
            <Card className="p-4">
              <ReferenceSection resumeData={resumeData} />
            </Card>
            <Card className="p-4">
              <AdditionalSection resumeData={resumeData} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
