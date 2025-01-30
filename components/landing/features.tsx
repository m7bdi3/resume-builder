import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, FileText, Zap, Trophy } from "lucide-react"

const features = [
  {
    title: "AI-Powered Resume Creation",
    description: "Our advanced AI analyzes your experience and skills to create a tailored, professional resume.",
    icon: BrainCircuit,
  },
  {
    title: "ATS-Friendly Templates",
    description: "Choose from a variety of templates designed to pass Applicant Tracking Systems with ease.",
    icon: FileText,
  },
  {
    title: "Real-Time Optimization",
    description: "Get instant feedback and suggestions to improve your resume as you build it.",
    icon: Zap,
  },
  {
    title: "Industry-Specific Keywords",
    description:
      "Automatically include relevant keywords for your industry to increase your chances of getting noticed.",
    icon: Trophy,
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

