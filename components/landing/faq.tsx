import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI-powered resume builder work?",
    answer:
      "Our AI analyzes your input and industry standards to create optimized, ATS-friendly resumes. It suggests improvements, formats content professionally, and provides real-time feedback.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties.",
  },
  {
    question: "Can I export my resume in different formats?",
    answer:
      "Yes, you can export your resume in PDF, DOCX, and other professional formats. Each format is optimized for both digital and print use.",
  },
  {
    question: "What makes D3 different from other resume builders?",
    answer:
      "D3 combines AI technology with real-time ATS scoring, providing instant feedback and optimization suggestions. Our platform ensures your resume stands out while meeting industry standards.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-background via-secondary/5 to-accent/5"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent  scroll-section">
            Common Questions
          </h2>
          <p className="text-muted-foreground text-lg  scroll-section">
            Everything you need to know about D3 Resume Builder
          </p>
        </div>

        <div className="max-w-3xl mx-auto border-2 rounded-xl bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-secondary/10 transition-all duration-300 scroll-section">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group border-b-2 last:border-b-0 transition-colors duration-300 hover:bg-gradient-to-r hover:from-secondary/5 hover:to-accent/5"
              >
                <AccordionTrigger className="flex w-full items-center justify-between px-6 py-4 text-left transition-all duration-300 group-hover:text-primary">
                  <span className="font-medium text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground  scroll-section">
          Still have questions?{" "}
          <a
            href="#contact"
            className="text-primary hover:underline transition-colors duration-300"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
