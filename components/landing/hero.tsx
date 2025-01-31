"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
      {/* Gradient layers with animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-background/0 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 z-10" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/60 via-transparent to-transparent z-10" />

      {/* Dynamic background elements */}
      <div className="absolute -right-16 bottom-0 size-96 bg-primary/20 blur-3xl rounded-full z-10" />
      <div className="absolute -inset-12 size-96 bg-primary/40 blur-3xl rounded-full z-10" />
      <div className="absolute size-[800px] bg-primary/20 blur-3xl rounded-full z-10" />

      <div className="container mx-auto relative z-10 px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 relative">
            <div className="relative text-center md:text-start">
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] font-heading">
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Craft Smart
                </span>
                <span className="block bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent relative">
                  Land Faster
                </span>
              </h1>

              <div className="h-[3px] w-3/4 bg-gradient-to-r from-primary to-primary/30 mt-6 mx-auto md:mx-0 origin-left " />

              <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] leading-relaxed mt-8 text-center md:text-start">
                AI-powered resume builder with real-time ATS scoring.
              </p>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-6 mt-10 relative">
              <div className="space-y-6 w-full">
                <div className="flex gap-6 items-center justify-center md:justify-start flex-wrap">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-7 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-primary/30 transition-all group"
                  >
                    <span>Start Free Now</span>
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-7 rounded-full border-2 hover:bg-accent/20 hover:border-primary/50 hover:text-primary transition-all"
                  >
                    See Examples
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center md:justify-start gap-4 opacity-80 mt-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full " />
                      98% Success Rate
                    </span>
                    <span className="h-6 w-px bg-border" />
                    <span>5000+ Careers Boosted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Interface Mockup */}
          <div className="relative group">
            {/* Main card */}
            <div className="w-full h-[580px] rounded-[2rem] shadow-2xl overflow-hidden border-2 border-primary/20 bg-background/80 backdrop-blur-lg transform transition-transform duration-300 hover:shadow-3xl">
              {/* Floating elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl -z-10 " />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-secondary/10 blur-3xl -z-10" />

              {/* Mock UI Content */}
              <div className="absolute top-6 left-6 right-6 flex gap-3 items-center">
                <div className="h-4 w-24 rounded-full bg-primary/20 " />
                <div className="flex-1 flex justify-center">
                  <div className="h-4 w-40 rounded-full bg-muted/50" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-primary/20 " />
              </div>

              <div className="absolute top-20 left-8 right-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 " />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded-full bg-primary/30" />
                    <div className="h-3 w-1/2 rounded-full bg-muted/50" />
                  </div>
                </div>
              </div>

              <div className="absolute top-36 left-8 right-8 bottom-20 space-y-6">
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/70 rounded-full " />
                  </div>
                  <div className="h-3 w-32 rounded-full bg-muted/50" />
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-lg bg-primary/20 " />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full rounded-full bg-primary/30" />
                      <div className="h-3 w-3/4 rounded-full bg-muted/50" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Leadership",
                    "Python",
                    "Project Mgmt",
                    "Data Analysis",
                  ].map((skill, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-muted/30 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {["Match Score", "Readability", "Keywords"].map((stat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-muted/10 text-center hover:bg-muted/20 transition-colors"
                    >
                      <div className="h-5 w-full rounded-full bg-primary/20 mb-2 " />
                      <div className="text-sm text-muted-foreground">
                        {stat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex gap-4 items-center">
                <div className="h-10 w-10 rounded-xl bg-primary/20 " />
                <div className="flex-1 h-10 rounded-xl bg-muted/50" />
                <div className="h-10 w-20 rounded-xl bg-primary/30 " />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated scrolling indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <div className="w-px h-12 bg-primary animate-bounce" />
        <span className="text-sm text-muted-foreground">Explore features</span>
      </div>
    </section>
  );
}
