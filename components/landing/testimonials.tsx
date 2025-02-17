"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Software Engineer",
    content:
      "D3 helped me land my dream job at a top tech company. The AI-powered resume builder is simply amazing and gave me the edge I needed!",
    avatar: "/avatars/alex.jpg",
  },
  {
    name: "Sarah Lee",
    role: "Marketing Manager",
    content:
      "I was skeptical at first, but D3 truly delivered. My resume now stands out, and I've received more interview calls than ever before. It's a game-changer!",
    avatar: "/avatars/sarah.jpg",
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    content:
      "The industry-specific keywords feature is brilliant. D3 made sure my resume was tailored perfectly for data science roles, significantly boosting my job search.",
    avatar: "/avatars/michael.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of professionals who transformed their careers with
            D3
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative border-2 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/20">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-primary/10">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors duration-300">
                        {testimonial.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0 text-3xl text-primary/30 font-serif">
                      &qout;
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {testimonial.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-muted-foreground text-sm"
        >
          Trusted by professionals at 1,000+ leading companies worldwide
        </motion.div>
      </div>
    </section>
  );
}
