import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/5 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent scroll-section">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-muted-foreground scroll-section">
            Join thousands of professionals who landed their dream jobs with
            D3-powered resumes
          </p>
        </div>

        <div>
          <Button
            size="lg"
            className="px-12 py-8 text-lg rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-primary/30 transition-all duration-300 group  scroll-section"
            asChild
          >
            <Link href="/resumes">
              Start Building Free Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-3xl -z-10 animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-secondary/20 to-accent/10 blur-3xl -z-10 animate-pulse" />

        <p className="mt-8 text-sm text-muted-foreground  scroll-section">
          No credit card required • Get started in 30 seconds
        </p>
      </div>
    </section>
  );
}
