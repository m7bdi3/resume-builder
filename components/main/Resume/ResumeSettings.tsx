"use server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ResumeServerData } from "@/lib/types";
import { ResumePreview } from "./ResumePreview/ResumePreview";

import { mapToResumeValues } from "@/lib/utils";
import { DeleteDialog } from "./DeleteResumeDiaog";
import { Edit, FileText } from "lucide-react";
import { formatDate } from "date-fns";
import Link from "next/link";

interface Props {
  resume: ResumeServerData | null;
}

export const ResumeSettings = async ({ resume }: Props) => {
  const resumeData = resume ? mapToResumeValues(resume) : {};

  if (!resume) {
    return null;
  }

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="container mx-auto relative p-4 space-y-4">
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
        <div className="space-y-6 flex w-full justify-center  bg-muted p-3 rounded-lg">
          <ResumePreview resumeData={resumeData} className=" shadow-md" />
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
                  className="h-32"
                />
              </div>

              <Button className="w-full" variant={"secondary"}>
                Analyze Compatibility
              </Button>

              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <Progress
                      value={75}
                      className="h-32 w-32 [&_circle]:stroke-primary"
                      style={{
                        stroke: resume.colorHex,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">75%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Key Matches</span>
                    <span>12/16</span>
                  </div>
                  <Progress value={(12 / 16) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Keywords Missing</span>
                    <span>4</span>
                  </div>
                  <div className="space-y-1">
                    {["Redux", "Node.js", "AWS", "Docker"].map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-destructive"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
