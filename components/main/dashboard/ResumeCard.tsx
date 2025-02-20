import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import type { ResumeServerData } from "@/lib/types";

export function ResumeCard({ item: resume }: { item: ResumeServerData }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">
          {resume.title || "Untitled Resume"}
        </CardTitle>
        <Badge variant="outline">
          {format(resume.updatedAt, "MMM dd, yyyy")}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {resume.jobTitle || "No job title"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/resumes/editor?resumeId=${resume.id}`}>
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
