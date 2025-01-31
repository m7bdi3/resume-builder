import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-muted/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of professionals who landed their dream jobs with
            D3-powered resumes
          </p>
        </div>

        <Button
          size="lg"
          className="px-12 py-8 text-lg rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-primary/30 transition-all"
        >
          Start Building Free Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Decorative elements */}
        <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-primary/10 blur-3xl -z-10" />
        <div className="absolute right-1/4 bottom-1/4 w-40 h-40 rounded-full bg-secondary/10 blur-3xl -z-10" />

        <p className="mt-8 text-sm text-muted-foreground">
          No credit card required • Get started in 30 seconds
        </p>
      </div>
    </section>
  );
}
