import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "1 resume",
      "Basic templates",
      "AI-powered suggestions",
      "PDF downloads",
    ],
  },
  {
    name: "Professional",
    price: "9.99",
    description: "For serious job seekers",
    features: [
      "Unlimited resumes",
      "Premium templates",
      "Advanced AI optimization",
      "Cover letter generator",
      "ATS scoring system",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: [
      "All Professional features",
      "Team collaboration",
      "Custom branding",
      "Dedicated support",
      "SSO & API access",
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Straightforward Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            No hidden fees. Switch plans or cancel anytime
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative h-full border-2 ${
                index === 1
                  ? "border-primary shadow-xl"
                  : "border-muted/50 hover:border-primary/20"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    {plan.price !== "Custom" && (
                      <span className="text-2xl">$</span>
                    )}
                    <span className="text-4xl font-bold">{plan.price}</span>
                  </div>
                  {plan.price !== "Custom" && (
                    <p className="text-muted-foreground">per month</p>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-primary shrink-0 mt-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    index === 1
                      ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                  variant={index === 1 ? "default" : "outline"}
                >
                  {index === 2 ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          30-day money back guarantee • No credit card required to start
        </div>
      </div>
    </section>
  );
}
