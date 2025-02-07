"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BackgroundSeparators } from "../background-separators";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-primary/20",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -150, rotate: rotate - 15 }
      }
      animate={
        shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate }
      }
      transition={{
        duration: shouldReduceMotion ? 0.5 : 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: shouldReduceMotion ? 0.5 : 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-primary/20",
            "shadow-[0_8px_32px_0_rgba(var(--primary),0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  title1 = "AI-powered resume builder with real-time ATS scoring.",
  title2 = "Craft Smart Land Faster",
}: {
  title1?: string;
  title2?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const fadeUpVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: shouldReduceMotion ? 0 : 0,
      transition: {
        duration: shouldReduceMotion ? 0.5 : 1,
        delay: shouldReduceMotion ? 0 : 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground"
      aria-label="Hero section"
    >
      <BackgroundSeparators />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--gradient-start)] via-transparent to-[var(--gradient-end)] blur-3xl"
        aria-hidden="true"
      />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-primary/20"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-secondary/20"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-accent/20"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-primary/20"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-secondary/20"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center  p-4">
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className=" font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80 text-xl sm:text-2xl md:text-4xl">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary text-4xl sm:text-6xl md:text-8xl",
                  pacifico.className
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
              <Button
                size="lg"
                className="px-8 py-7 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl hover:shadow-primary/30 transition-all group"
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
                className="px-8 py-7 rounded-full border-2  transition-all"
              >
                See Examples
              </Button>
            </div>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="w-4 h-4 bg-green-500 rounded-full"
                  aria-hidden="true"
                />
                <span aria-label="98% Success Rate">98% Success Rate</span>
              </span>
              <span className="h-6 w-px bg-border" aria-hidden="true" />
              <span
                className="w-4 h-4 bg-yellow-500 rounded-full"
                aria-hidden="true"
              />
              <span aria-label="5000+ Careers Boosted">
                5000+ Careers Boosted
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {mounted && (
        <>
          <Image
            src={
              currentTheme === "dark"
                ? "/assets/herodark.svg"
                : "/assets/hero.svg"
            }
            alt="Illustrative hero image showing a person crafting a resume"
            width={550}
            height={200}
            className=" absolute left-0 hidden lg:block object-cover rounded-xl animate-fade-in-right top-12 "
          />

          <Image
            src={
              currentTheme === "dark"
                ? "/assets/hero2dark.svg"
                : "/assets/hero2.svg"
            }
            alt="Illustrative hero image showing a person crafting a resume"
            width={550}
            height={200}
            className=" absolute right-12 hidden lg:block object-cover rounded-xl animate-fade-in-left bottom-0"
          />
        </>
      )}
    </section>
  );
}
