"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does D3 use AI to create resumes?",
    answer:
      "D3 uses advanced natural language processing to analyze your input and generate optimized content for your resume. It considers industry standards, job requirements, and best practices to create a tailored, professional resume that highlights your strengths and experiences.",
  },
  {
    question: "Is my data safe with D3?",
    answer:
      "Absolutely. We take data privacy very seriously. All your information is encrypted and stored securely using industry-standard protocols. We never share your personal data with third parties without your explicit consent. Your privacy and security are our top priorities.",
  },
  {
    question: "Can I use D3 for free?",
    answer:
      "Yes, we offer a free Basic plan that allows you to create one resume with access to our AI-powered suggestions and basic templates. This is a great way to try out our service and see how D3 can help you create a standout resume.",
  },
  {
    question: "How often can I update my resume?",
    answer:
      "You can update your resume as often as you like. We encourage users to keep their resumes up-to-date with their latest experiences and skills. Our AI-powered system makes it easy to make quick updates and improvements to your resume at any time.",
  },
  {
    question: "Does D3 offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee for our paid plans. If you're not satisfied with our service, you can request a full refund within 30 days of your purchase. We're confident in the value we provide, but we want you to feel secure in your decision to use D3.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Common Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about D3 Resume Builder
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto border-2 rounded-xl bg-background shadow-sm"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b-2 last:border-b-0"
              >
                <AccordionTrigger className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Still have questions?{" "}
          <a href="#contact" className="text-primary hover:underline">
            Contact our support team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
