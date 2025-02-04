"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { PlusSquare } from "lucide-react";
import usePremiumModal from "@/hooks/usePremiumModal";

interface Props {
  canCreate: boolean;
}

export const CreateResumeButton = ({ canCreate }: Props) => {
  const { setOpen } = usePremiumModal();

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href={"/editor"}>
          <PlusSquare className="size-5" />
          New Resume
        </Link>
      </Button>
    );
  }

  return (
    <Button onClick={() => setOpen(true)} className="flex w-fit gap-2">
      <PlusSquare className="size-5" />
      New Resume
    </Button>
  );
};
