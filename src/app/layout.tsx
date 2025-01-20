import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppBar } from "@/components/AppBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TimeMachine } from "@/components/TimeMachine";
import { StartTimeMachine } from "@/components/StartTimeMachine";
import Apollo from "./Apollo";
import { NoSsr } from "@/components/NoSsr";
import NextAuthSession from "@/components/NextAuthSession";
import { auth } from "@/auth";
import ShadCnChat from "@/components/chat/ShadCnChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <StartTimeMachine />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthSession session={session}>
            <Apollo>
              {/* <NoSsr> */}

              {/* </NoSsr> */}
              <AppBar />
              <div className="p-4">{children}</div>
            </Apollo>
            <ShadCnChat size="sm" />
          </NextAuthSession>
        </ThemeProvider>
      </body>
    </html>
  );
}
