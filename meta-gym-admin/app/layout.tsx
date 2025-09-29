import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
