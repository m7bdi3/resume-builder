import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { atsResult } from "@prisma/client";

export function AtsCard({ result }: { result: atsResult }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{result.title}</CardTitle>
        <Badge variant="secondary">ATS</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {result.jobDescription || "No job description"}
        </p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={`/dashboard/ats/create?id=${result.id}`}>Edit</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
