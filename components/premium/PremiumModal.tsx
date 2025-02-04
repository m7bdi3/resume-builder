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
  const isDesktop = useMedia("(min-width: 768px)", false);

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
        onOpenChange={() => {
          if (!loading) {
            setOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Unlock Premium Features
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Upgrade your experience with powerful tools and customization
              options.
            </DialogDescription>
          </DialogHeader>
          <Content
            loading={loading}
            handlePremiumClick={handlePremiumClick}
            className="p-6"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={() => {
        if (!loading) {
          setOpen(false);
        }
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Unlock Premium Features</DrawerTitle>
          <DrawerDescription>
            Upgrade your experience with powerful tools and customization
            options.
          </DrawerDescription>
        </DrawerHeader>
        <Content
          className="px-4 pb-6"
          loading={loading}
          handlePremiumClick={handlePremiumClick}
        />
        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                if (!loading) {
                  setOpen(false);
                }
              }}
            >
              Cancel
            </Button>
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
    <div className={cn("grid gap-8 md:grid-cols-2", className)}>
      <div className="flex flex-col gap-6 rounded-xl bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Premium
          </span>
          <h3 className="text-2xl font-bold">Essential Features</h3>
        </div>
        <ul className="space-y-3">
          {premiumFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="mt-1 size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY)}
          disabled={loading}
          className="mt-auto w-full"
        >
          Get Premium
        </Button>
      </div>

      <div className="flex flex-col gap-6 rounded-xl bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <span className="rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
            Premium +
          </span>
          <h3 className="text-2xl font-bold">Advanced Features</h3>
        </div>
        <ul className="space-y-3">
          {premiumPlusFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="mt-1 size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          onClick={() =>
            handlePremiumClick(env.NEXT_PUBLIC_STRIPE_PRO_PLUS_MONTHLY)
          }
          disabled={loading}
          className="mt-auto w-full"
        >
          Get Premium+
        </Button>
      </div>
    </div>
  );
}
