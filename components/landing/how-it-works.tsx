"use client";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  "Sign up for a free account",
  "Input your work experience and skills",
  "Choose a template and customize your resume",
  "Let our AI optimize your content",
  "Download your perfect resume",
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-b from-background to-muted/10"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-5 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Craft Your Perfect Resume in 5 Steps
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional results in minutes with our intuitive process
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-start">
          <div className="space-y-5">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-5 p-5 rounded-xl border bg-background hover:bg-muted/5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-lg text-primary">
                    {index + 1}
                  </span>
                </div>
                <p className="text-lg font-medium pt-1.5">{step}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden border bg-background shadow-sm group"
          >
            <div className="aspect-[1.6] bg-muted/30 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-primary/10" />
              <div className="relative z-10 text-center p-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <PlayCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  See How It Works
                </h3>
                <p className="text-muted-foreground text-lg">
                  2-minute walkthrough video
                </p>
              </div>
            </div>
            <div className="p-5 bg-muted/5">
              <div className="flex gap-2">
                <div className="h-2 w-20 rounded-full bg-muted/50" />
                <div className="h-2 w-16 rounded-full bg-muted/50" />
                <div className="h-2 w-24 rounded-full bg-muted/50" />
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="pt-12 text-center w-full"
        >
          <Button className="px-10 py-7 text-lg rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/30 transition-all duration-300 mx-auto">
            Get Started Now →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
