import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 mt-24">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Branding Section */}
          <div className="space-y-4 max-w-sm">
            <h3 className="text-lg font-semibold">D3 Resume Builder</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering job seekers with AI-driven tools to create winning resumes and land dream jobs.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-2xl">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-1">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-1">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-1">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Connect</h4>
              <ul className="space-y-1">
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} D3 Resume Builder. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}