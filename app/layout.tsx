import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import { SignOut } from "@/components/auth/SignOutButton";

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
    <html lang="en">
      <body className={inter.variable}>
        <header className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Task Management</h1>
            <SignOut />
          </div>
        </header>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
