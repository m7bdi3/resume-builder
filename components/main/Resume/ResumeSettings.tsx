"use client";

import Link from "next/link";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ResumePreview } from "./ResumePreview/ResumePreview";
import { DeleteDialog } from "./DeleteResumeDiaog";

import { Edit, FileText } from "lucide-react";
import { formatDate } from "date-fns";
import {
  analyzeJobDescription,
  ATSComparisonResult,
} from "@/actions/ai.actions";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  resume: ResumeServerData | null;
}

export const ResumeSettings = ({ resume }: Props) => {
  const resumeData = resume ? mapToResumeValues(resume) : {};
  const [jobDescription, setJobDescription] = useState<string | undefined>(
    undefined
  );
  const [returnedData, setReturnedData] = useState<
    ATSComparisonResult | undefined
  >(undefined);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  if (!resume) {
    return null;
  }

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  async function handleClick() {
    startTransition(async () => {
      try {
        const res = await analyzeJobDescription({
          ...resumeData,
          jobDescription: jobDescription,
        });
        setReturnedData(res);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Analysis failed. Please try again.",
        });
      }
    });
  }

  // Calculate overall score based on all scores.
  const calculateOverallScore = () => {
    if (!returnedData) return 0;
    const scores = Object.values(returnedData.scores);
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(0);
  };

  const overallScore = calculateOverallScore();

  // Define category order and display names.
  const categories = [
    { key: "technicalKeywords", label: "Technical Keywords" },
    { key: "industryTerms", label: "Industry Terms" },
    { key: "toolsTechnologies", label: "Tools & Technologies" },
    { key: "softSkills", label: "Soft Skills" },
    { key: "atsPriorityTerms", label: "ATS Priority Terms" },
  ];

  // Helper: parse suggestion text to extract missing terms (if any)
  const parseMissingTerms = (suggestion: string): string[] => {
    if (suggestion.startsWith("Missing")) {
      const parts = suggestion.split(":");
      if (parts.length > 1) {
        return parts[1]
          .split(",")
          .map((term) => term.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  return (
    <div className="lg:container mx-auto relative p-4 space-y-4">
      {/* Resume header */}
      <Card className="h-32 w-full p-4 mt-6 flex items-center justify-between bg-muted">
        <div>
          <h2>{resume.title}</h2>
          <p>{resume.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {wasUpdated ? "Updated" : "Created"} •{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size={"lg"} asChild>
            <Link href={`/editor?resumeId=${resume.id}`}>
              <Edit className="h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant="default">
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
          <DeleteDialog resumeId={resume.id} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 flex w-full justify-center bg-muted p-3 rounded-lg">
          <ResumePreview resumeData={resumeData} className="shadow-md" />
        </div>

        <div className="space-y-6 col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold">ATS Score Analysis</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Job Description</p>
                <Textarea
                  placeholder="Paste job description here..."
                  className="field-sizing-fixed"
                  rows={20}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                variant={"secondary"}
                onClick={handleClick}
                disabled={isPending}
              >
                Analyze Compatibility
              </Button>

              {returnedData && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <Progress
                        value={Number(overallScore)}
                        className="h-32 w-32 [&_circle]:stroke-primary"
                        style={{ stroke: resume.colorHex }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {overallScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed breakdown for each category */}
                  <div className="grid grid-cols-1 gap-4">
                    {categories.map(({ key, label }) => {
                      const score =
                        returnedData.scores[
                          key as keyof ATSComparisonResult["scores"]
                        ];
                      const suggestion =
                        returnedData.suggestions[
                          key as keyof ATSComparisonResult["suggestions"]
                        ];
                      const missing = parseMissingTerms(suggestion);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{label}</span>
                            <span>{score.toFixed(0)}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            {suggestion}
                          </p>
                          {missing.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {missing.map((term) => (
                                <Badge
                                  key={term}
                                  variant="outline"
                                  className="text-destructive"
                                >
                                  {term}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
