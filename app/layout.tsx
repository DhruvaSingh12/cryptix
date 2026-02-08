import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AuthProvider from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";


const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monocera",
  description: "Cryptocurrency exploration, analysis, and portfolio management platform",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} w-full bg-background text-foreground h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
