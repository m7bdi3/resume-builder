"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
  gradient = "from-primary/30",
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
  title2 = "Craft Smart. Land Faster.",
}: {
  title1?: string;
  title2?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.5 : 1,
        delay: shouldReduceMotion ? 0 : 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section
      className="relative min-h-[90vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground"
      aria-label="Hero section"
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--gradient-start)] via-transparent to-[var(--gradient-end)] blur-3xl opacity-75"
        aria-hidden="true"
      />

      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-primary/20"
          className="left-[-15%] sm:left-[-10%] md:left-[-5%] top-[15%] md:top-[20%] opacity-90"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-secondary/20"
          className="right-[-10%] sm:right-[-5%] md:right-[0%] top-[70%] md:top-[75%] opacity-85"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-accent/20"
          className="left-[2%] sm:left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%] opacity-80"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-primary/20"
          className="right-[10%] sm:right-[15%] md:right-[20%] top-[10%] md:top-[15%] opacity-75"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-secondary/20"
          className="left-[15%] sm:left-[20%] md:left-[25%] top-[5%] md:top-[10%] opacity-70"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center p-4">
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="font-bold tracking-tight mb-6 md:mb-8">
              <span className="block text-lg sm:text-2xl md:text-3xl lg:text-5xl leading-tight text-accent">
                {title1}
              </span>

              <span
                className={cn(
                  "block bg-clip-text text-transparent",
                  "bg-gradient-to-r from-primary via-accent to-primary",
                  "text-4xl sm:text-5xl md:text-7xl leading-tight mt-2",
                  pacifico.className
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.p
            custom={1.5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Build a professional resume in minutes using advanced AI and get
            instant ATS feedback. Step confidently into your dream career!
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center mt-8">
              <Button
                size="lg"
                className="px-12 py-8 rounded-full bg-gradient-to-r from-primary to-primary/90
                           hover:from-primary/90 hover:to-primary text-primary-foreground
                           shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 group"
                asChild
              >
                <Link href="/dashboard">
                  Start Free Now
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
