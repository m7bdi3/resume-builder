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

export default function MinimalistBlocks({ resumeData }: Props) {
  return (
    <div className="p-8 text-sm">
      <Card className="p-6 mb-6 bg-background">
        <PersonalInfoHeader resumeData={resumeData} />
      </Card>
      <div className="grid grid-cols-2 gap-6">
        {resumeData.summary && resumeData.summary.length > 1 && (
          <Card className="p-6 bg-background col-span-2">
            <SummarySection resumeData={resumeData} />
          </Card>
        )}
        {(resumeData.softSkills && resumeData.softSkills?.length > 1) ||
          (resumeData.technicalSkills &&
            resumeData.technicalSkills?.length > 1 && (
              <Card className="p-6 bg-background">
                <SkillsSection resumeData={resumeData} />
              </Card>
            ))}
        {resumeData.workExperience && resumeData.workExperience.length > 1 && (
          <Card className="p-6 bg-background">
            <WorkExperienceSection resumeData={resumeData} />
          </Card>
        )}

        {resumeData.educations && resumeData.educations.length > 1 && (
          <Card className="p-6 bg-background col-span-2">
            <EducationSection resumeData={resumeData} />
          </Card>
        )}

        {resumeData.projects && resumeData.projects?.length > 1 && (
          <Card className="p-6 bg-background">
            <ProjectsSection resumeData={resumeData} />
          </Card>
        )}

        {resumeData.certifications && resumeData.certifications?.length > 1 && (
          <Card className="p-6 bg-background">
            <CertificationsSection resumeData={resumeData} />
          </Card>
        )}

        {resumeData.references && resumeData.references?.length > 1 && (
          <Card className="p-6 bg-background">
            <ReferenceSection resumeData={resumeData} />
          </Card>
        )}
        {(resumeData.achievements && resumeData.achievements.length > 1) ||
          (resumeData.hobbies && resumeData.hobbies?.length > 1) ||
          (resumeData.languages && resumeData.languages?.length > 1 && (
            <Card className="p-6 bg-background col-span-2">
              <AdditionalSection resumeData={resumeData} />
            </Card>
          ))}
      </div>
    </div>
  );
}
