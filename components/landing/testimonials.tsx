import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Software Engineer",
    content:
      "D3 helped me land my dream job at a top tech company. The AI-powered resume builder is simply amazing!",
    avatar: "/avatars/alex.jpg",
  },
  {
    name: "Sarah Lee",
    role: "Marketing Manager",
    content:
      "I was skeptical at first, but D3 truly delivered. My resume now stands out and I've received more interview calls than ever before.",
    avatar: "/avatars/sarah.jpg",
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    content:
      "The industry-specific keywords feature is a game-changer. D3 made sure my resume was tailored perfectly for data science roles.",
    avatar: "/avatars/michael.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of professionals who transformed their careers
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="relative border-2 hover:border-primary/20 transition-colors shadow-sm hover:shadow-md overflow-hidden"
            >
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
                    <CardTitle>{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6">
                  <span className="absolute left-0 top-0 text-3xl text-primary/30 font-serif">
                    “
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {testimonial.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-muted-foreground text-sm">
          Trusted by professionals at 1,000+ leading companies worldwide
        </div>
      </div>
    </section>
  );
}