import { CoverLetterValues, ResumeValues } from "@/lib/validation";
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";
import { ColorPicker } from "@/components/main/Resume/ColorPicker";
import { BorderStyleButton } from "@/components/main/Resume/BorderStyleButton";
import { cn } from "@/lib/utils";
import { CoverLetterPreview } from "@/components/main/coverLetter/CoverLetterPreview/CoverLetterPreview";
import { ProfessionalTemplate } from "./Resume/ResumePreview/templates/ProfessionalTemplate";
import { ClassicTemplate } from "./Resume/ResumePreview/templates/ClassicTemplate";
import BoldHeader from "./Resume/ResumePreview/templates/bold-header";
import ModernAsymmetric from "./Resume/ResumePreview/templates/modern-asymmetric";
import MinimalistBlocks from "./Resume/ResumePreview/templates/minimalist-blocks";
import ElegantCentered from "./Resume/ResumePreview/templates/elegant-centered";
import { ModernTemplate } from "./Resume/ResumePreview/templates/ModernTemplate";
interface Props {
  resumeData?: ResumeValues;
  coverLetterData?: CoverLetterValues;
  setResumeData?: (data: ResumeValues) => void;
  className?: string;
  isResume: boolean;
}

export const PreviewSection = ({
  resumeData,
  coverLetterData,
  setResumeData,
  className,
  isResume,
}: Props) => {
  const renderTemplate = () => {
    switch (resumeData?.template) {
      case "CLASSIC":
        return <ClassicTemplate resumeData={resumeData} />;
      case "MODERN":
        return <ModernAsymmetric resumeData={resumeData} />;
      case "MINIMAL":
        return <ModernTemplate resumeData={resumeData} />;
      case "PROFESSIONAL":
        return <ProfessionalTemplate resumeData={resumeData} />;
      case "ELEGANT":
        return <ElegantCentered resumeData={resumeData} />;
      case "BOLDHEADER":
        return <BoldHeader resumeData={resumeData} />;
      case "BLOCKS":
        return <MinimalistBlocks resumeData={resumeData} />;
      default:
        return <ClassicTemplate resumeData={resumeData!} />;
    }
  };
  return (
    <div
      className={cn("group relative hidden w-full md:flex md:w-1/2", className)}
    >
      {isResume && (
        <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
          <ColorPicker
            color={resumeData?.colorHex}
            onChange={(color) => {
              if (setResumeData)
                setResumeData({
                  ...resumeData,
                  colorHex: color.hex,
                  template: resumeData?.template || "CLASSIC",
                });
            }}
          />
          <BorderStyleButton
            borderStyle={resumeData?.borderStyle}
            onChange={(borderStyle) => {
              if (setResumeData) {
                setResumeData({
                  ...resumeData,
                  borderStyle,
                  template: resumeData?.template || "CLASSIC",
                });
              }
            }}
          />
        </div>
      )}
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        {isResume ? (
          <ResumePreview
            resumeData={resumeData}
            className="max-w-2xl shadow-md"
            renderTemplate={renderTemplate}
          />
        ) : (
          <CoverLetterPreview
            coverLetterData={coverLetterData}
            className="max-w-2xl shadow-md"
          />
        )}
      </div>
    </div>
  );
};
