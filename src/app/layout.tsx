import QueryProvider from "@providers/QueryProvider";

import type { Metadata } from "next";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "@app/globals.css";
import "@styles/style.css";
import "@styles/media.css";

// FONTS
import "font-awesome/css/font-awesome.min.css";
import "@fonts/stylesheet.css";

export const metadata: Metadata = {
  title: "TruckMatch - Fleet Management System",
  description: "Manage your fleet, drivers, and jobs efficiently in one place",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
