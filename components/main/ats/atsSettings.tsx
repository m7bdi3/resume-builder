"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  Loader2,
  FileText,
  Zap,
  Sparkles,
  Info,
} from "lucide-react";
import {
  AnalyzedData,
  analyzeJobDescription,
  improveResumeData,
} from "@/actions/ai.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useToast } from "@/hooks/use-toast";
import { cn, mapToResumeValues } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResumeServerData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useAtsStore } from "@/hooks/store/useAtsStore";

export const AtsSettings = () => {
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");
  const { ats, addAts } = useAtsStore();

  const foundAts = ats.find((a) => a.id === existingId);

  const [analysisResult, setAnalysisResult] = useState<AnalyzedData>(
    (foundAts?.response as AnalyzedData) || undefined
  );
  const [jobDescription, setJobDescription] = useState<string>(
    foundAts?.jobDescription || ""
  );
  const [title, setTitle] = useState<string>(foundAts?.title || "");
  
  const [isPending, startTransition] = useTransition();
  const [selectedResume, setSelectedResume] = useState<string>(
    foundAts?.resumeId || ""
  );
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { resumes, addResume } = useResumeStore();
  const foundResume = resumes.find((r) => r.id === selectedResume);

  const handleAnalyzeResume = async () => {
    if (!selectedResume) {
      setError("Please select a resume before analyzing.");
      return;
    }
    setError(null);
    const resume = mapToResumeValues(foundResume || ({} as ResumeServerData));

    startTransition(async () => {
      try {
        const res = await analyzeJobDescription({
          resumeData: resume,
          jobDescription,
          title,
          id: existingId || undefined,
        });
        setAnalysisResult(res.response);
        addAts(res);

        if (!existingId) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("id", res.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          );
        }
        toast({
          title: "Analysis Complete",
          description:
            "Your resume has been analyzed against the job description.",
        });
      } catch (error) {
        console.error(error);
        setError("Analysis failed. Please try again.");
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description:
            "There was an error analyzing your resume. Please try again.",
        });
      }
    });
  };

  const handleUpdateResume = async () => {
    if (!analysisResult) {
      setError("Please analyze your resume first before improving it.");
      return;
    }
    setError(null);
    const resume = mapToResumeValues(foundResume || ({} as ResumeServerData));

    startTransition(async () => {
      try {
        const improved = await improveResumeData({
          resumeData: resume,
          analysisData: analysisResult as AnalyzedData,
        });
        addResume(improved);
        toast({
          title: "Resume Updated",
          description: "Your resume has been improved based on the analysis.",
        });

        const res = await analyzeJobDescription({
          resumeData: resume,
          jobDescription,
          title,
        });
        setAnalysisResult(res.response);
      } catch (error) {
        console.error(error);
        setError("Update failed. Please try again.");
        toast({
          variant: "destructive",
          title: "Update Failed",
          description:
            "There was an error updating your resume. Please try again.",
        });
      }
    });
  };
  const finalScore =
    analysisResult &&
    typeof analysisResult === "object" &&
    "score" in analysisResult
      ? Math.min(Math.max(analysisResult.score, 0), 100)
      : 0;

  return (
    <Card className="lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Zap className="h-6 w-6" />
          ATS Score Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid  gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium flex items-center gap-2"
            >
              Title
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The title for the document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Ats for job"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="jobDescription"
              className="text-sm font-medium flex items-center gap-2"
            >
              Job Description
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Paste the full job description here for analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste job description here..."
              className="h-40 resize-none mt-2"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="resumeSelect"
              className="text-sm font-medium flex items-center gap-2"
            >
              Select Resume
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose the resume you want to analyze against</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select onValueChange={setSelectedResume} value={selectedResume}>
              <SelectTrigger id="resumeSelect" className="mt-2">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{resume.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(resume.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full"
          onClick={handleAnalyzeResume}
          disabled={isPending || !jobDescription || !selectedResume}
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
          <div className="space-y-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Overall Match Score</CardTitle>
                  <Badge
                    variant={
                      finalScore >= 75
                        ? "default"
                        : finalScore >= 50
                          ? "warning"
                          : "destructive"
                    }
                    className="text-lg font-bold px-4 py-2"
                  >
                    {finalScore}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress
                    value={finalScore}
                    className={cn(
                      finalScore >= 75
                        ? "bg-green-500"
                        : finalScore >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500",
                      "h-3"
                    )}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">ATS Compatibility</span>
                    <span className="text-muted-foreground">
                      {getScoreFeedback(finalScore)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategorySection
                title="Missing Technical Skills"
                items={analysisResult.technical}
                icon="💻"
                description="Key technical requirements from the job description"
              />
              <CategorySection
                title="Missing Industry Terms"
                items={analysisResult.industry}
                icon="🏭"
                description="Specialized jargon and domain-specific terminology"
              />
              <CategorySection
                title="Missing Tools & Tech"
                items={analysisResult.technologies}
                icon="🛠️"
                description="Required software, frameworks, and platforms"
              />
              <CategorySection
                title="Missing Soft Skills"
                items={analysisResult.softSkills}
                icon="🤝"
                description="Personality traits and interpersonal skills"
              />
              <CategorySection
                title="Critical ATS Gaps"
                items={analysisResult.atsPriorityTerms}
                icon="❗"
                description="Mandatory requirements that need immediate attention"
                highlightMissing
              />
            </div>

            <div className="space-y-4">
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
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-Optimize Resume
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Tip: We&apos;ll add missing keywords naturally throughout your
                resume
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CategorySection = ({
  title,
  items,
  icon,
  description,
  highlightMissing = false,
}: {
  title: string;
  items: string[];
  icon: string;
  description?: string;
  highlightMissing?: boolean;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-base flex items-center gap-2">
        <span>{icon}</span>
        {title}
        <Badge
          variant={highlightMissing ? "destructive" : "secondary"}
          className="ml-2"
        >
          {items?.length} Missing
        </Badge>
      </CardTitle>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </CardHeader>
    <CardContent className="max-h-[200px] overflow-y-auto">
      {items && items.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
          {items?.map((item, index) => (
            <Badge
              key={index}
              variant={highlightMissing ? "destructive" : "outline"}
              className="font-normal break-words whitespace-normal text-left h-auto min-h-[32px] hover:bg-opacity-80 transition-opacity px-2.5 py-1 max-w-full"
            >
              <span>{item}</span>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
          <span className="mr-2">✅</span>
          All requirements met in this category
        </div>
      )}
    </CardContent>
  </Card>
);

const getScoreFeedback = (score: number) => {
  if (score >= 90) return "Excellent match!";
  if (score >= 75) return "Good match";
  if (score >= 60) return "Moderate match";
  if (score >= 40) return "Needs significant improvement";
  return "Poor match - Major revisions needed";
};
