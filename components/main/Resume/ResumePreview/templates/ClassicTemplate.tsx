import { ResumeValues } from "@/lib/validation";
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
  contentRef?: React.Ref<HTMLDivElement>;
}

export const ClassicTemplate = ({ resumeData, contentRef }: Props) => {
  return (
    <div className={"space-y-6 p-6"} ref={contentRef} id="resumePreviewContent">
      <PersonalInfoHeader resumeData={resumeData} />
      <SummarySection resumeData={resumeData} />
      <WorkExperienceSection resumeData={resumeData} />
      <EducationSection resumeData={resumeData} />
      <ProjectsSection resumeData={resumeData} />
      <SkillsSection resumeData={resumeData} />
      <CertificationsSection resumeData={resumeData} />
      <AdditionalSection resumeData={resumeData} />
      <ReferenceSection resumeData={resumeData} />
    </div>
  );
};
