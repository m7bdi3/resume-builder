import Link from "next/link";
import { Button } from "@/components/ui/button";
type CreateButtonVariant = "resume" | "letter" | "ats" | "gap" | "interview";

interface CreateButtonProps {
  variant: CreateButtonVariant;
}

const pathMap: Record<CreateButtonVariant, string> = {
  resume: "/dashboard/resumes/editor",
  letter: "/dashboard/coverletters/editor",
  ats: "/dashboard/ats/create",
  gap: "/dashboard/gap/create",
  interview: "/dashboard/interview/create",
};

export const CreateButton = ({ variant }: CreateButtonProps) => {
  return (
    <Button asChild className={"flex gap-2"}>
      <Link href={pathMap[variant]}>Create</Link>
    </Button>
  );
};
