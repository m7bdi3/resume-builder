import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit, FileText, Zap, Trophy } from "lucide-react";

const features = [
  {
    title: "AI-Powered Resume Creation",
    description:
      "Our advanced AI analyzes your experience and skills to create a tailored, professional resume.",
    icon: BrainCircuit,
  },
  {
    title: "ATS-Friendly Templates",
    description:
      "Choose from a variety of templates designed to pass Applicant Tracking Systems with ease.",
    icon: FileText,
  },
  {
    title: "Real-Time Optimization",
    description:
      "Get instant feedback and suggestions to improve your resume as you build it.",
    icon: Zap,
  },
  {
    title: "Industry-Specific Keywords",
    description:
      "Automatically include relevant keywords for your industry to increase your chances of getting noticed.",
    icon: Trophy,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Smart Resume Building Tools
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to create a job-winning resume in minutes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="h-full border-2 hover:border-primary/20 transition-colors shadow-sm hover:shadow-md"
            >
              <CardHeader className="pb-4">
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
