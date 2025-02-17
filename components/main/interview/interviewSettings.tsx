"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  Loader2,
  Zap,
  Info,
  CheckCircle,
  FileText,
  Search,
} from "lucide-react";
import { IntreviewQS, intreviewQS } from "@/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";

export const InterviewSettings = () => {
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id");
  const { interviews, addInterview } = useInterviewStore();

  const foundInterview = existingId
    ? interviews.find((g) => g.id === existingId)
    : undefined;

  const [analysisResult, setAnalysisResult] = useState<IntreviewQS[]>(
    (foundInterview?.response as IntreviewQS[]) || undefined
  );

  const [jobDescription, setJobDescription] = useState<string>(
    foundInterview?.jobDescription || ""
  );

  const [title, setTitle] = useState<string>(foundInterview?.title || "");

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();

  const handleAnalyze = async () => {
    setError(null);
    startTransition(async () => {
      try {
        setProgress(0);
        const intervalId = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 10 : prev));
        }, 500);

        const res = await intreviewQS({
          jobDescription,
          title,
          id: existingId || undefined,
        });
        clearInterval(intervalId);
        setProgress(100);
        setAnalysisResult(res.response);
        addInterview(res);
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
          description: "Your Interview Q&S has been created.",
        });
      } catch (error) {
        console.error(error);
        setError("Analysis failed. Please try again.");
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description:
            "There was an error analyzing your Job Description. Please try again.",
        });
      }
    });
  };

  return (
    <Card className="lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Zap className="h-6 w-6" />
          Interview Preparation Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Job Description</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResult}>
              Analysis Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input">
            <div className="space-y-6">
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

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={handleAnalyze}
                disabled={isPending || !jobDescription}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Job Description
                  </>
                )}
              </Button>

              {isPending && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress < 100 ? "Analyzing..." : "Analysis complete!"}
                  </p>
                </div>
              )}

              {analysisResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Analysis Complete</AlertTitle>
                  <AlertDescription>
                    Your job description has been analyzed. View the results in
                    the Analysis Results tab.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="results">
            {analysisResult && (
              <InterviewAnalysisPreview analysisResult={analysisResult} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export const InterviewAnalysisPreview = ({
  analysisResult,
}: {
  analysisResult: IntreviewQS[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "Technical Expertise",
    "Problem Solving",
    "Team Collaboration",
    "Domain Knowledge",
  ];

  const complexityColor = {
    basic: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  const filteredResults = analysisResult.filter(
    (question) =>
      (selectedCategory ? question.category === selectedCategory : true) &&
      (searchTerm
        ? question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interview Analysis Results</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category ? null : category
              )
            }
            className="text-sm"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions or answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResults.map((question, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{question.question}</CardTitle>
              <Badge className={`${complexityColor[question.complexity]} mt-2`}>
                {question.complexity}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <h4 className="font-semibold mb-1">Answer:</h4>
              <p className="text-sm mb-4">{question.answer}</p>
              <h4 className="font-semibold mb-1">Context:</h4>
              <p className="text-sm">{question.context}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredResults.length === 0 && (
        <p className="text-center text-muted-foreground">No results found.</p>
      )}
    </div>
  );
};
