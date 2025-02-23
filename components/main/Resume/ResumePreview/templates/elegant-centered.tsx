import { Separator } from "@/components/ui/separator";
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
export default function ElegantCentered({ resumeData }: Props) {
  return (
    <div className=" p-12 text-sm flex flex-col items-center">
      <PersonalInfoHeader resumeData={resumeData} />
      <Separator className="my-6 w-full" />
      <div className="space-y-8">
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
        <ProjectsSection resumeData={resumeData} />
        <CertificationsSection resumeData={resumeData} />
        <ReferenceSection resumeData={resumeData} />
        <AdditionalSection resumeData={resumeData} />
      </div>
    </div>
  );
}
