import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const steps = [
  "Sign up for a free account",
  "Input your work experience and skills",
  "Choose a template and customize your resume",
  "Let our AI optimize your content",
  "Download your perfect resume",
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <ul className="space-y-4">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8">Get Started Now</Button>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <div className="aspect-video bg-zinc-950 rounded-md"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
