import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redis } from "@/lib/redis";
import { Suspense } from "react";

interface Props {
  searchParams: { token?: string };
}

export default function PaymentSuccessPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentSuccessContent token={searchParams.token} />
    </Suspense>
  );
}

async function PaymentSuccessContent({ token }: { token?: string }) {
  if (!token) {
    console.error("No token provided for payment success verification");
    redirect("/billing");
  }

  try {
    const isValid = await redis.get<string>(`payment_success:${token}`);
    if (!isValid) {
      console.warn(`Invalid or expired token: ${token}`);
      redirect("/billing");
    }
    await redis.del(`payment_success:${token}`);

    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] p-4 relative overflow-hidden">
        <Image
          src="/assets/404 page.svg"
          alt="Decorative background shape"
          width={1000}
          height={400}
          className="object-cover absolute top-0 mt-6"
          priority
        />
        <div className="flex flex-col items-center mt-auto gap-6 text-center max-w-md z-10 p-8 rounded-lg  animate-fade-in-up">
          <h1 className="text-3xl font-bold mt-4">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your subscription has been activated
            successfully.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/resumes" className="flex items-center font-bold group">
              Go to Resumes
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error verifying success token:", error);
    redirect("/billing");
  }
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-medium">Verifying your payment...</p>
      </div>
    </div>
  );
}
