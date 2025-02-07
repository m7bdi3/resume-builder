"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? " bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm"
          : "border-b-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src={"/assets/logo.png"}
              alt="logo"
              width={40}
              height={40}
              className="rounded-full invert dark:invert-0"
            />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            asChild
            className="hidden md:flex rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/20"
          >
            <Link href="/resumes">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
