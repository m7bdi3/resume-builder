import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does D3 use AI to create resumes?",
    answer:
      "D3 uses advanced natural language processing to analyze your input and generate optimized content for your resume. It considers industry standards, job requirements, and best practices to create a tailored, professional resume.",
  },
  {
    question: "Is my data safe with D3?",
    answer:
      "Yes, we take data privacy very seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent.",
  },
  {
    question: "Can I use D3 for free?",
    answer:
      "Yes, we offer a free Basic plan that allows you to create one resume with access to our AI-powered suggestions and basic templates.",
  },
  {
    question: "How often can I update my resume?",
    answer:
      "You can update your resume as often as you like. We encourage users to keep their resumes up-to-date with their latest experiences and skills.",
  },
  {
    question: "Does D3 offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee for our paid plans. If you're not satisfied with our service, you can request a full refund within 30 days of your purchase.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
