import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/ui/header";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      // Update deprecated props
      fallbackRedirectUrl="/sign-in"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
         <ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
  <Header />
  <main className="min-h-screen pt-16">
    {children}
  </main>
  <Toaster richColors position="top-center" />

  <footer className="bg-muted/50 py-12">
    <div className="container mx-auto px-4 text-center text-gray-200">
      <p>Made with 💗 by Rohit Singh</p>
    </div>
  </footer>
</ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}