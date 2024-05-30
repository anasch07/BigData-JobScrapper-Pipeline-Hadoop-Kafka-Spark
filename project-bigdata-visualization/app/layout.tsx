import type { Metadata } from "next";
import {Inter, Poppins} from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobDash Insights",
  description: "A bigData project to explore spark, kafka, hadoop, and more",
};

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`relative flex-grow ${poppins.className} pb-44`}>
    {children}</body>
    </html>
  );
}
