import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Basic",
    price: "$0",
    description: "Perfect for getting started",
    features: ["1 resume", "Basic templates", "AI-powered suggestions"],
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For serious job seekers",
    features: ["Unlimited resumes", "Premium templates", "Advanced AI optimization", "Cover letter generator"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: ["All Pro features", "Team collaboration", "Custom branding", "Dedicated support"],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={index === 1 ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{plan.price}</p>
                {plan.price !== "Custom" && <p className="text-muted-foreground">/month</p>}
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mr-2 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{index === 2 ? "Contact Sales" : "Get Started"}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

