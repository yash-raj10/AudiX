import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import PrelineScript from "@/components/PerlineScript";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <PrelineScript />
        <body className={inter.className}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
