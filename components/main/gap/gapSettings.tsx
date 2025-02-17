"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  Loader2,
  FileText,
  Zap,
  Info,
  CheckCircle,
} from "lucide-react";
import { gapAnalysis, GapAnalysisResult } from "@/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { mapToResumeValues } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ResumeServerData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useGapStore } from "@/hooks/store/useGapStore";
import { Input } from "@/components/ui/input";

export const GapSettings = () => {
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");
  const { gaps, addGap } = useGapStore();

  const foundGap = existingId
    ? gaps.find((g) => g.id === existingId)
    : undefined;

  const [analysisResult, setAnalysisResult] = useState<GapAnalysisResult>(
    (foundGap?.response as GapAnalysisResult) || undefined
  );

  const [jobDescription, setJobDescription] = useState<string>(
    foundGap?.jobDescription || ""
  );

  const [title, setTitle] = useState<string>(foundGap?.title || "");

  const [isPending, startTransition] = useTransition();
  const [selectedResume, setSelectedResume] = useState<string>(
    foundGap?.resumeId || ""
  );

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();
  const { resumes } = useResumeStore();

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
        setProgress(0);
        const intervalId = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 10 : prev));
        }, 500);

        const res = await gapAnalysis({
          resumeData: resume,
          jobDescription,
          title,
          id: existingId || undefined,
        });
        clearInterval(intervalId);
        setProgress(100);
        setAnalysisResult(res.response);
        addGap(res);
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

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <Tabs defaultValue="skills-gaps" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills-gaps">Skills Gaps</TabsTrigger>
          <TabsTrigger value="resume-improvements">Improvements</TabsTrigger>
          <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>
        <TabsContent value="skills-gaps">
          <Card>
            <CardHeader>
              <CardTitle>Skills and Experience Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.skillsAndExperienceGaps.map((gap, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{gap.gapName}</h4>
                    <Badge
                      variant={
                        gap.severity === "Critical"
                          ? "destructive"
                          : gap.severity === "High"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {gap.severity}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">
                    <strong>Type:</strong> {gap.type}
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`gap-${index}`}>
                      <AccordionTrigger>View Details</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm mt-1">
                          <strong>Job Requirement:</strong>{" "}
                          {gap.jobDescriptionExcerpt}
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Your Resume:</strong> {gap.resumeComparison}
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Suggestion:</strong> {gap.mitigationStrategy}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resume-improvements">
          <Card>
            <CardHeader>
              <CardTitle>Resume Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.resumeImprovementSuggestions.map(
                (suggestion, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-md">
                    <h4 className="font-semibold">{suggestion.section}</h4>
                    <p className="text-sm">
                      <strong>Action:</strong> {suggestion.action}
                    </p>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`suggestion-${index}`}>
                        <AccordionTrigger>View Example</AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-2">
                            <p className="text-sm">
                              <strong>Before:</strong>{" "}
                              {suggestion.example.before}
                            </p>
                            <p className="text-sm mt-1">
                              <strong>After:</strong> {suggestion.example.after}
                            </p>
                            <p className="text-sm mt-1">
                              <strong>Rationale:</strong>{" "}
                              {suggestion.example.rationale}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="action-plan">
          <Card>
            <CardHeader>
              <CardTitle>Long-Term Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.longTermActionPlan.map((action, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <h4 className="font-semibold">{action.category}</h4>
                  <p className="text-sm">{action.recommendation}</p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`action-${index}`}>
                      <AccordionTrigger>View Resources</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside text-sm">
                          {action.resources.map((resource, idx) => (
                            <li key={idx}>{resource}</li>
                          ))}
                        </ul>
                        <p className="text-sm mt-1">
                          <strong>Timeframe:</strong> {action.timeframe}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>Prioritized Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.prioritizedRoadmap.map((item, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Priority {item.priority}</h4>
                    <Badge variant="outline">{item.estimatedEffort}</Badge>
                  </div>
                  <p className="text-sm mt-1">{item.task}</p>
                  <p className="text-sm mt-1">
                    <strong>Expected Impact:</strong> {item.expectedImpact}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Card className="lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Zap className="h-6 w-6" />
          GAP Score Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6">
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
              placeholder="e.g. title for job"
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
            "Analyze"
          )}
        </Button>

        {isPending && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {progress < 100
                ? "Analyzing your resume..."
                : "Analysis complete!"}
            </p>
          </div>
        )}

        {analysisResult && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              Your resume has been analyzed against the job description. View
              the results below.
            </AlertDescription>
          </Alert>
        )}

        {renderAnalysisResult()}
      </CardContent>
    </Card>
  );
};
