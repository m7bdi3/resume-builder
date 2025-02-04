import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

// Configure Rajdhani for headings
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "700"], // Use 500 for medium, 700 for bold
  variable: "--font-heading", // CSS variable name
});

// Configure Inter for body
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body", // CSS variable name
});

export const metadata: Metadata = {
  title: {
    template: "%s - D3 Resume Builder",
    absolute: "D3 Resume Builder",
  },
  description: "AI Resume builder is the easiest way to create a pro resume",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${rajdhani.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
