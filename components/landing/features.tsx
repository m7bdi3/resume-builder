"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit, FileText, Zap, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Resume Creation",
    description:
      "Our advanced AI analyzes your experience and skills to create a tailored, professional resume that stands out.",
    icon: BrainCircuit,
  },
  {
    title: "ATS-Friendly Templates",
    description:
      "Choose from a variety of templates designed to pass Applicant Tracking Systems with ease, increasing your chances of landing an interview.",
    icon: FileText,
  },
  {
    title: "Real-Time Optimization",
    description:
      "Get instant feedback and suggestions to improve your resume as you build it, ensuring you present your best self to potential employers.",
    icon: Zap,
  },
  {
    title: "Industry-Specific Keywords",
    description:
      "Automatically include relevant keywords for your industry to increase your chances of getting noticed by recruiters and hiring managers.",
    icon: Trophy,
  },
  {
    title: "Personalized Career Insights",
    description:
      "Receive tailored career advice and job market insights based on your profile and industry trends.",
    icon: Sparkles,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Smart Resume Building Tools
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to create a job-winning resume in minutes
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md group">
                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
