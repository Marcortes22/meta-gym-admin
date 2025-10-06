import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/shared/providers/query-provider";

export const metadata: Metadata = {
  title: "Meta Gym Admin",
  description: "Admin dashboard for Meta Gym",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
