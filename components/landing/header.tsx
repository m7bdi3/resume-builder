"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 1, name: "Features", href: "#features" },
    { id: 2, name: "How It Works", href: "#how-it-works" },
    { id: 3, name: "Pricing", href: "#pricing" },
    { id: 4, name: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm"
          : "border-b-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src={"/assets/logo.png"}
              alt="logo"
              width={40}
              height={40}
              className="rounded-full invert dark:invert-0"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.id}>
              <Link
                href={item.href}
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground px-2 py-1.5 rounded-lg transition-colors"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            asChild
            className="hidden md:flex rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/20"
          >
            <Link href="#cta">Get Started</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b md:hidden shadow-xl">
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <Button
                asChild
                className="mt-4 w-full rounded-full bg-gradient-to-r from-primary to-primary/90"
              >
                <Link href="#cta">Get Started</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
