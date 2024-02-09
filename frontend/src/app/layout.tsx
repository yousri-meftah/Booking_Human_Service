"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/sections/NavBar";

const inter = Inter({ subsets: ["latin"] });
import { useEffect, useState } from "react";
import checkTokenExists  from "../lib/checktoken";

/*export const metadata: Metadata = {
  title: "Booking App",
  description: "Booking human services",
};
*/
import { useRouter } from 'next/navigation';
export default function RootLayout({ children ,} : Readonly<{
  children: React.ReactNode;
}>) {
  const [islogin,setislogin] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const tokenExists = checkTokenExists();
    if (!tokenExists) {
      // If there's no token, redirect them to the login page
      setislogin(true)
    }
    return () => {
      console.log('Component will unmount');
    };
    // This empty array means the effect runs once on mount
  }, [router]);

  return (
    <html lang="en">
      
      <body className={inter.className}>
        <NavBar ok={islogin} />
        {children}
      </body>
    </html>
  );
}
