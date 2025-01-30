import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect Resume?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of job seekers who have found success with D3.
        </p>
        <Button size="lg">Get Started for Free</Button>
      </div>
    </section>
  )
}

