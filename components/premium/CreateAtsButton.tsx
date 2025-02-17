"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CreateAtsButton = () => {
  return (
    <Button asChild>
      <Link href={"/dashboard/ats/create"}>Create</Link>
    </Button>
  );
};
