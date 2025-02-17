"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CreateGapButton = () => {
  return (
    <Button asChild>
      <Link href={"/dashboard/gap/create"}>Create</Link>
    </Button>
  );
};
