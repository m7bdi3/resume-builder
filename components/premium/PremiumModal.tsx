"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useMedia } from "react-use";
import { Check } from "lucide-react";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/actions/premium.actions";
import { env } from "@/env";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = ["Infinite resumes", "Design Customizations"];

export function PremiumModal() {
  const { open, setOpen } = usePremiumModal();
  const isDesktop = useMedia("(min-width: 768px)");

  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true);
      const res = await createCheckoutSession(priceId);
      window.location.href = res;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!loading) {
            setOpen(!open);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              Resume Builder Premium
            </DialogTitle>
            <DialogDescription className="text-center">
              Get a premium subscription to unlock all features and templates.
            </DialogDescription>
          </DialogHeader>
          <Content loading={loading} handlePremiumClick={handlePremiumClick} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(!open);
        }
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Resume Builder Premium</DrawerTitle>
          <DrawerDescription>
            Get a premium subscription to unlock all features and templates.
          </DrawerDescription>
        </DrawerHeader>
        <Content
          className="px-4"
          loading={loading}
          handlePremiumClick={handlePremiumClick}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface Props {
  handlePremiumClick: (priceId: string) => void;
  className?: string;
  loading: boolean;
}

function Content({ className, handlePremiumClick, loading }: Props) {
  return (
    <div className={cn("flex", className)}>
      <div className="flex w-1/2 flex-col space-y-5">
        <h3 className="text-center text-lg font-bold">Premium </h3>
        <ul className="list-inside space-y-2">
          {premiumFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY)}
          disabled={loading}
        >
          Get Premium
        </Button>
      </div>
      <div className="border-1 mx-6" />
      <div className="flex w-1/2 flex-col space-y-5">
        <h3 className="text-center text-lg font-bold">Premium +</h3>
        <ul className="list-inside space-y-2">
          {premiumPlusFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          onClick={() =>
            handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRO_PLUS_MONTHLY)
          }
          disabled={loading}
        >
          Get Premium +
        </Button>
      </div>
    </div>
  );
}
