"use client";
import { useRef, useState, useTransition } from "react";

import Link from "next/link";
import type { CoverLetterServerData, ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";

import {
  Edit,
  FileText,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { formatDate } from "date-fns";

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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Link
        href="/resumes"
        className="inline-flex items-center text-lg font-semibold hover:underline"
      >
        <ChevronLeft className="h-5 w-5 mr-2" />
        All Resumes
      </Link>

      <Card className="bg-muted">
        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{resume.title}</h1>
            <p className="text-muted-foreground">{resume.description}</p>
            <p className="text-sm text-muted-foreground">
              {wasUpdated ? "Updated" : "Created"} •{" "}
              {formatDate(resume.updatedAt, "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href={`/editor?resumeId=${resume.id}`}>
                <Edit className="h-4 w-4 mr-2" /> Edit Resume
              </Link>
            </Button>
            <Button variant="default" onClick={() => reactToPrintFn()}>
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <DeleteDialog id={resume.id} isResume />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-8">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex-1">Cover Letters</CardTitle>
              <CreateCoverLetterButton
                canCreate={canCreate}
                resumeId={resume.id}
              />
            </CardHeader>
            <CardContent className="space-y-4">
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
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>ATS Score Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="jobDescription" className="text-sm font-medium">
                Job Description
              </label>
              <Textarea
                id="jobDescription"
                placeholder="Paste job description here..."
                className="h-40 resize-none"
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Improving...
                    </span>
                  ) : (
                    "Auto-Improve Resume"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
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
          <AlertCircle className="h-4 w-4 mr-2" />
          No {title.toLowerCase()} found
        </div>
      )}
    </CardContent>
  </Card>
);
