import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle } from "lucide-react";

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
      className="py-24 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Simple 5-Step Process
          </h2>
          <p className="text-muted-foreground text-lg">
            Create your perfect resume in minutes with our guided workflow
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2  items-start">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl border-2 bg-background hover:border-primary/20 transition-colors row-span-1"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="space-y-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <p className="text-lg font-medium">{step}</p>
                </div>
              </div>
            ))}
            <Button className="w-full md:w-auto px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/20">
              Start Building Now →
            </Button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 bg-background h-full">
            <div className="aspect-video bg-muted/50 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-primary/5" />
              <div className="relative z-10 text-center space-y-4 p-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">See it in action</h3>
                <p className="text-muted-foreground">
                  Watch our 2-minute demo video
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="h-3 w-full rounded-full bg-muted/50" />
              <div className="h-3 w-3/4 rounded-full bg-muted/50" />
              <div className="h-3 w-2/3 rounded-full bg-muted/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
