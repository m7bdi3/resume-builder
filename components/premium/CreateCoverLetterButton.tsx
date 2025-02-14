"use client";

import Link from "next/link";
import { PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useResumeStore } from "@/hooks/store/useResumeStore";

export const CreateCoverLetterButton = () => {
  const { setOpen } = usePremiumModal();

  const { canCreate } = useResumeStore();

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href={`/dashboard/coverletters/editor`}>
          <PlusSquare className="size-5" />
          Create
        </Link>
      </Button>
    );
  }

  return (
    <Button onClick={() => setOpen(true)} className="flex w-fit gap-2">
      <PlusSquare className="size-5" />
      Create
    </Button>
  );
};
