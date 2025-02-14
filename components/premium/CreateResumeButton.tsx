"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import usePremiumModal from "@/hooks/usePremiumModal";

interface Props {
  canCreate: boolean;
}

export const CreateResumeButton = ({ canCreate }: Props) => {
  const { setOpen } = usePremiumModal();

  if (canCreate) {
    return (
      <Button asChild className="flex w-fit gap-2">
        <Link href={"/dashboard/resumes/editor"}>
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
