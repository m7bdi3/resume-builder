"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BackgroundSeparators } from "../background-separators";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen w-full flex items-center justify-center">
      <Image
        src={"/assets/Asset 1.svg"}
        alt={"Background shape"}
        width={1700}
        height={40}
        className="absolute -translate-x-1/4 lg:translate-x-1/2 animate-float"
      />
      <BackgroundSeparators />

      <div className="container mx-auto w-full relative z-10 mt-16 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center content-between w-full">
          <div className="space-y-8 lg:col-span-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-9xl font-bold tracking-tighter leading-tight font-heading animate-fade-in">
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Craft Smart <br /> Land Faster
                </span>
              </h1>
              <p className="mt-2 text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-delay">
                AI-powered resume builder with real-time ATS scoring.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mt-10">
              <Button
                size="lg"
                className="px-8 py-7 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-primary/30 transition-all group animate-fade-in-up"
                asChild
              >
                <Link href="/resumes">
                  Start Free Now
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-7 rounded-full border-2 transition-all animate-fade-in-up"
              >
                See Examples
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 opacity-80 mt-4 text-sm text-muted-foreground animate-fade-in-delay">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full" />
                98% Success Rate
              </span>
              <span className="h-6 w-px bg-border" />
              <span>5000+ Careers Boosted</span>
            </div>
          </div>

          <div className="hidden lg:block w-full">
            <Image
              src="/assets/hero.svg"
              alt="Illustrative hero image showing a person crafting a resume"
              width={600}
              height={500}
              className="object-cover rounded-xl animate-fade-in-left"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20 animate-fade-in-up">
        <Separator className="h-16 w-0.5 animate-bounce" />
        <span className="text-muted-foreground">Explore features</span>
      </div>
    </section>
  );
}
