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
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const ProfessionalTemplate = ({
  resumeData,
  contentRef,
  className,
}: Props) => {
  return (
    <div
      className={cn("max-w-4xl mx-auto p-8", className)}
      ref={contentRef}
      id="resumePreviewContent"
    >
      <div
        className="mb-8 border-b-2 pb-6"
        style={{ borderColor: resumeData?.colorHex || "#000000" }}
      >
        <PersonalInfoHeader resumeData={resumeData || {}} />
        <div className="mt-4">
          <SummarySection resumeData={resumeData || {}} />
        </div>
      </div>

      <div className="">
        <div className=" space-y-8">
          <div className=" rounded-lg">
            <WorkExperienceSection resumeData={resumeData || {}} />
          </div>

          <div className=" rounded-lg">
            <ProjectsSection resumeData={resumeData || {}} />
          </div>

          <div className=" rounded-lg">
            <EducationSection resumeData={resumeData || {}} />
          </div>
        </div>

        <div className="space-y-8">
          <div
            className=" rounded-lg p-6"
            style={{
              backgroundColor: `${resumeData?.colorHex}25` || "#f8f9fa",
            }}
          >
            <SkillsSection resumeData={resumeData || {}} />
          </div>

          <div className=" rounded-lg">
            <CertificationsSection resumeData={resumeData || {}} />
          </div>

          <div className=" rounded-lg">
            <ReferenceSection resumeData={resumeData || {}} />
          </div>

          <div className=" rounded-lg">
            <AdditionalSection resumeData={resumeData || {}} />
          </div>
        </div>
      </div>
    </div>
  );
};
