"use client";

import Link from "next/link";
import type { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ResumePreview } from "./ResumePreview/ResumePreview";
import { DeleteDialog } from "./DeleteResumeDiaog";

import {
  Edit,
  FileText,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { formatDate } from "date-fns";

import { useRef, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useReactToPrint } from "react-to-print";
import type { ResumeValues } from "@/lib/validation";
import {
  analyzeJobDescription,
  type AnalyzedData,
  improveResumeData,
} from "@/actions/ai.actions";

interface Props {
  resume: ResumeServerData | null;
}

export const ResumeSettings = ({ resume }: Props) => {
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
      <Link href="/resumes" className="flex gap-2 items-center  group ">
        <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform duration-150" />
        <span className="text-lg font-semibold group-hover:underline duration-150">
          All Resumes
        </span>
      </Link>
      <Card className="bg-muted">
        <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{resume.title}</h1>
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
            <DeleteDialog resumeId={resume.id} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit lg:sticky top-8">
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
                <span className="flex items-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  {"Analyzing..."}
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
                    color="bg-blue-100 dark:bg-blue-800"
                  />
                  <CategorySection
                    title="Industry Terms"
                    items={analysisResult.industry}
                    color="bg-green-100 dark:bg-green-800"
                  />
                  <CategorySection
                    title="Tools & Technologies"
                    items={analysisResult.technologies}
                    color="bg-purple-100 dark:bg-purple-800"
                  />
                  <CategorySection
                    title="Soft Skills"
                    items={analysisResult.softSkills}
                    color="bg-yellow-100 dark:bg-yellow-800"
                  />
                  <CategorySection
                    title="ATS Priority Terms"
                    items={analysisResult.atsPriorityTerms}
                    color="bg-red-100 dark:bg-red-800"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpdateResume}
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-3">
                      <Loader2 className="size-4 animate-spin" />
                      {"Improving..."}
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
    <CardContent className="relative">
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
