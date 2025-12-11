import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - TruckMatch",
  description: "Login to manage your fleet and jobs efficiently",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
