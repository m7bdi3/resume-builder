import { FilePen } from "lucide-react";
import { CreateButton } from "./CreateItemButton";
interface Props {
  type: "resume" | "letter" | "ats" | "gap" | "interview";
}

export function EmptyState({ type }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No {type.toUpperCase()} found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new {type.toUpperCase()}
        </p>
      </div>
      <CreateButton variant={type} />
    </div>
  );
}
