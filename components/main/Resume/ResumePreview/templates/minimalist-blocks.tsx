import { ResumeValues } from "@/lib/validation";
import { PersonalInfoHeader } from "@/components/main/Resume/ResumePreview/PersonalInfoHeader";
import { SummarySection } from "@/components/main/Resume/ResumePreview/SummarySection";
import { WorkExperienceSection } from "@/components/main/Resume/ResumePreview/WorkExperienceSection";
import { EducationSection } from "@/components/main/Resume/ResumePreview/EducationSection";
import { SkillsSection } from "@/components/main/Resume/ResumePreview/SkillsSection";
import { ProjectsSection } from "@/components/main/Resume/ResumePreview/ProjectsSection";
import { CertificationsSection } from "@/components/main/Resume/ResumePreview/CertificatesSection";
import { ReferenceSection } from "@/components/main/Resume/ResumePreview/ReferenceSection";
import { AdditionalSection } from "@/components/main/Resume/ResumePreview/AdditionalSection";

interface Props {
  resumeData: ResumeValues;
  className?: string;
}

export default function MinimalistBlocks({ resumeData }: Props) {
  return (
    <div className="p-8 text-sm">
      <div
        className="p-6 mb-6 rounded"
        style={{
          backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
        }}
      >
        <PersonalInfoHeader resumeData={resumeData} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div
          className="p-6 col-span-2 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <SummarySection resumeData={resumeData} />
        </div>

        <div
          className="p-6 rounded col-span-2"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <WorkExperienceSection resumeData={resumeData} />
        </div>
        <div
          className="p-6 col-span-2 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <EducationSection resumeData={resumeData} />
        </div>
        <div
          className="p-6 rounded col-span-2"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <ProjectsSection resumeData={resumeData} />
        </div>
        <div
          className="p-6 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <SkillsSection resumeData={resumeData} />
        </div>
        <div
          className="p-6 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)/20",
          }}
        >
          <AdditionalSection resumeData={resumeData} />
        </div>

        <div
          className="p-6 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <CertificationsSection resumeData={resumeData} />
        </div>

        <div
          className="p-6 rounded"
          style={{
            backgroundColor: `${resumeData?.colorHex}25` || "var(--primary)",
          }}
        >
          <ReferenceSection resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}
