import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { steps } from "@/lib/steps";
import { Coversteps } from "@/lib/Coversteps";

interface Props {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  resumeSteps: boolean;
}

export const Breadcrumbs = ({
  currentStep,
  setCurrentStep,
  resumeSteps,
}: Props) => {
  const stepsToRender = resumeSteps ? steps : Coversteps;

  return (
    <div className="w-full py-4 px-2">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center justify-center gap-1 flex-wrap">
          {stepsToRender.map((step, index) => (
            <Fragment key={step.key}>
              <BreadcrumbItem 
                className={`cursor-pointer transition-all duration-200 hover:opacity-80 ${step.key === currentStep ? 'scale-105' : ''}`}
              >
                {step.key === currentStep ? (
                  <BreadcrumbPage className="font-medium text-primary">
                    {step.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    onClick={() => setCurrentStep(step.key)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {step.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < stepsToRender.length - 1 && (
                <BreadcrumbSeparator className="text-muted-foreground/50" />
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
