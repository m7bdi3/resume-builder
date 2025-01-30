import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <Image
        src="/assets/hero.jpg"
        alt="Abstract gradient background"
        fill
        className="object-cover object-center"
      />
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Create Stunning Resumes with AI
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            D3 uses advanced AI to help you craft the perfect resume. Stand out
            from the crowd and land your dream job.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Get Started for Free</Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
