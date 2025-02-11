import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";

interface HeaderProps {
  totalCount: number;
  subLevel: string;
  canCreate: boolean;
  title: string;
}

export function Header({
  totalCount,
  subLevel,
  canCreate,
  title,
}: HeaderProps) {
  return (
    <Card className="bg-card backdrop-blur-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <Badge variant="secondary" className="text-sm capitalize">
              {subLevel.replaceAll("_", " ")} Tier
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "document" : "documents"} stored
          </p>
        </div>

        <CreateResumeButton canCreate={canCreate} />
      </CardHeader>
    </Card>
  );
}
