import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata = {
  metadataBase: new URL("https://postgres-kysely.vercel.app"),
  title: "Next Tasks Management",
  description:
    "A simple Next.js app with a Postgres database and Kysely as the ORM",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full" lang="en">
      <body className={cn("h-full flex flex-col", inter.variable)}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
