import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserNavButton } from "./user-button";
import { ThemeToggle } from "../theme-toggle";
export const Navbar = () => {
  return (
    <header className="shadow-sm bg-primary/20">
      <div className="max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">
        <Link href={"/resumes"} className="flex items-center gap-2">
          <Image
            src={"/assets/logo.png"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-full invert dark:invert-0"
          />
          <span className="text-xl font-bold tracking-tight">
            Resume Builder
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserNavButton />
        </div>
      </div>
    </header>
  );
};
