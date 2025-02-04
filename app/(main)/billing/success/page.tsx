import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold mt-4">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your subscription has been activated
            successfully.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/resumes" className="flex items-center">
              Go to Resumes <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
