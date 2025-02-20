import CTA from "@/components/landing/cta";
import FAQ from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import HeroGeometric from "@/components/landing/heroWithShapes";
import HowItWorks from "@/components/landing/how-it-works";
import ScrollToTopButton from "@/components/landing/scroll-to-top-button";
import Testimonials from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen h-full w-full relative mx-auto">
      <Header />
      <HeroGeometric />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
