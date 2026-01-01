import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import { GOOGLE_MAPS_API_KEY } from "@constants";
import { AuthProvider } from "@providers/AuthProvider";
import QueryProvider from "@providers/QueryProvider";

import type { Metadata } from "next";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "@app/globals.css";
import "@styles/media.css";
import "@styles/header.css";
import "@styles/offcanvas-animations.css";

// FONTS
import "font-awesome/css/font-awesome.min.css";

const roboto = localFont({
  src: [
    {
      path: "../fonts/Roboto-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Roboto-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Roboto-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Roboto-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "TruckMatch - Fleet Management System",
  description: "Manage your fleet, drivers, and jobs efficiently in one place",
  icons: {
    icon: "./favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        {/* Move Google Maps script here */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />

        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
