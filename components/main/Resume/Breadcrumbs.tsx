import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
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
  return (
    <div className="flex justify-center items-center w-full">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center justify-center">
          {resumeSteps ? (
            <>
              {steps.map((step) => (
                <React.Fragment key={step.key}>
                  <BreadcrumbItem className="cursor-pointer">
                    {step.key === currentStep ? (
                      <BreadcrumbPage>{step.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink onClick={() => setCurrentStep(step.key)}>
                        {step.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="last:hidden" />
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {Coversteps.map((step) => (
                <React.Fragment key={step.key}>
                  <BreadcrumbItem className="cursor-pointer">
                    {step.key === currentStep ? (
                      <BreadcrumbPage>{step.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink onClick={() => setCurrentStep(step.key)}>
                        {step.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="last:hidden" />
                </React.Fragment>
              ))}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
