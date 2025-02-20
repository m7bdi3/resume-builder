import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 ">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent  scroll-section">
            Success Stories
          </h2>
          <p className="text-muted-foreground text-lg  scroll-section">
            Join thousands of professionals who transformed their careers with
            D3
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              <Card className="relative h-full border-2 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-secondary/10 overflow-hidden group scroll-section  scroll-section">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/20 group-hover:border-secondary/40 transition-colors duration-300">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-accent/10 text-accent/80">
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
                      <p className="text-sm text-muted-foreground font-medium group-hover:text-muted-foreground/80 transition-colors duration-300">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-0 text-3xl text-primary/30 font-serif group-hover:text-primary/40 transition-colors duration-300">
                      &quot;
                    </span>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                      {testimonial.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-muted-foreground text-sm  scroll-section">
          Trusted by professionals at 1,000+ leading companies worldwide
        </div>
      </div>
    </section>
  );
}
