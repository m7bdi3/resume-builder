import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";

interface HeaderProps {
  totalCount: number;
  canCreate: boolean;
  title: string;
}

export function Header({ totalCount, canCreate, title }: HeaderProps) {
  return (
    <Card className="backdrop-blur-sm bg-accent/20">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg sm:text-2xl font-bold">
              {title}
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "document" : "documents"}
          </p>
        </div>

        <CreateResumeButton canCreate={canCreate} />
      </CardHeader>
    </Card>
  );
}
