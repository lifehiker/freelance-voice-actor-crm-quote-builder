import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "VoiceQuote CRM — Quote Builder for Voice Actors",
    template: "%s | VoiceQuote CRM",
  },
  description:
    "The voice-over-specific CRM and quote builder for freelance voice actors. Track auditions, build quotes with usage rights, and manage clients in one workflow.",
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
        <Toaster />
      </body>
    </html>
  );
}
