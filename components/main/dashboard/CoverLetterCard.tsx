import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CoverLetterServerData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns/format";

export function CoverLetterCard({
  item: letter,
}: {
  item: CoverLetterServerData;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">
          {letter.title || "Untitled Cover"}
        </CardTitle>
        <Badge variant="outline">
          {format(letter.updatedAt, "MMM dd, yyyy")}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {letter.jobDescription || "No job description"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/coverletters/editor?coverId=${letter.id}`}>
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
