"use client";
import { useRef, useState, useTransition } from "react";

import Link from "next/link";
import type { CoverLetterServerData, ResumeServerData } from "@/lib/types";

import { mapToResumeValues } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Textarea } from "@/components/ui/textarea";
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";
import { formatDate } from "date-fns";
import { Edit, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReactToPrint } from "react-to-print";
import type { ResumeValues } from "@/lib/validation";
import {
  analyzeJobDescription,
  type AnalyzedData,
  improveResumeData,
} from "@/actions/ai.actions";
import { CreateCoverLetterButton } from "@/components/premium/CreateCoverLetterButton";
import { DeleteDialog } from "@/components/main/DeleteResumeDiaog";
import { CoverLetterItem } from "@/components/main/coverLetter/CoverLettertem";
import { Label } from "@/components/ui/label";

interface Props {
  resume: ResumeServerData | null;
  canCreate: boolean;
}

export const ResumeSettings = ({ resume, canCreate }: Props) => {
  const resumeData = resume ? mapToResumeValues(resume) : ({} as ResumeValues);
  const contentRef = useRef<HTMLDivElement>(null);

  const [jobDescription, setJobDescription] = useState<string | undefined>();
  const [analysisResult, setAnalysisResult] = useState<AnalyzedData>();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume?.title || "Resume",
  });

  if (!resume) {
    return null;
  }

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  async function handleAnalyzeResume() {
    startTransition(async () => {
      try {
        const res = await analyzeJobDescription({
          resumeData: resumeData,
          jobDescription: jobDescription ?? "",
        });
        setAnalysisResult(res);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Analysis failed. Please try again.",
        });
      }
    });
  }

  async function handleUpdateResume() {
    startTransition(async () => {
      try {
        if (analysisResult)
          await improveResumeData({
            resumeData: resumeData,
            analysisData: analysisResult,
          });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Update failed. Please try again.",
        });
      } finally {
        const res = await analyzeJobDescription({
          resumeData: resumeData,
          jobDescription: jobDescription ?? "",
        });
        setAnalysisResult(res);
      }
    });
  }

  return (
    <div className="container mx-auto px-4  space-y-8">
      <Card className="bg-primary/40 hover:bg-primary/50 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold capitalize">
            {resume.title}
          </CardTitle>
          <p className="text-muted-foreground line-clamp-2 mt-2">
            {resume.description}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} at {" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href={`/resumes/editor?resumeId=${resume.id}`}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                <Edit className="size-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="default"
              onClick={() => reactToPrintFn()}
              className="w-full sm:w-auto"
              aria-label="Export resume"
            >
              <FileText className="size-4" />
              Export
            </Button>
          </div>
          <DeleteDialog id={resume.id} isResume />
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumePreview
                resumeData={resumeData}
                className="shadow-md max-h-[calc(100vh-200px)] overflow-y-auto"
                contentRef={contentRef}
              />
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex-1">Cover Letters</CardTitle>
              <CreateCoverLetterButton
                canCreate={canCreate}
                resumeId={resume.id}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-4 md:grid-cols-2 gap-4">
              {resumeData.coverLetters &&
              resumeData.coverLetters.filter((cov) => cov !== undefined)
                .length > 0 ? (
                resumeData.coverLetters
                  .filter((cov) => cov !== undefined)
                  .map((cov) => (
                    <CoverLetterItem
                      key={cov.id}
                      coverLetter={cov as CoverLetterServerData}
                    />
                  ))
              ) : (
                <p className="text-muted-foreground">No Cover Letters found</p>
              )}
            </CardContent>
          </Card> */}
        </div>

        {/* <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>ATS Score Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-sm font-medium">
                Job Description
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste job description here..."
                className="h-40 resize-none mt-2"
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              variant="secondary"
              onClick={handleAnalyzeResume}
              disabled={isPending || !jobDescription}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Compatibility"
              )}
            </Button>

            {analysisResult && (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Overall Match Score</CardTitle>
                      <Badge
                        variant="outline"
                        className="text-lg font-bold px-4 py-2"
                      >
                        {analysisResult.score}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={analysisResult.score} className="h-2" />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CategorySection
                    title="Technical Skills"
                    items={analysisResult.technical}
                    color="bg-blue-100 dark:bg-blue-800/30"
                  />
                  <CategorySection
                    title="Industry Terms"
                    items={analysisResult.industry}
                    color="bg-green-100 dark:bg-green-800/30"
                  />
                  <CategorySection
                    title="Tools & Technologies"
                    items={analysisResult.technologies}
                    color="bg-purple-100 dark:bg-purple-800/30"
                  />
                  <CategorySection
                    title="Soft Skills"
                    items={analysisResult.softSkills}
                    color="bg-yellow-100 dark:bg-yellow-800/30"
                  />
                  <CategorySection
                    title="ATS Priority Terms"
                    items={analysisResult.atsPriorityTerms}
                    color="bg-red-100 dark:bg-red-800/30"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpdateResume}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="size-4ate-spin" />
                      Improving...
                    </span>
                  ) : (
                    "Auto-Improve Resume"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

const CategorySection = ({
  title,
  items,
  color,
  highlightMissing = false,
}: {
  title: string;
  items: string[];
  color: string;
  highlightMissing?: boolean;
}) => (
  <Card className={`${color} border-0`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-base flex items-center justify-between">
        {title}
        <Badge variant="secondary" className="ml-2">
          {items.length}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={index}
              variant={highlightMissing ? "destructive" : "secondary"}
              className="font-normal break-words"
            >
              {item}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="flex items-center text-muted-foreground text-sm">
          <AlertCircle className="size-4" />
          No {title.toLowerCase()} found
        </div>
      )}
    </CardContent>
  </Card>
);
