// src/app/(auth)/page.tsx
import React from "react";
import Link from "next/link";
import Icon from "@/components/common/Icon/page";
import dynamic from "next/dynamic";

// The LoginForm is interactive — import as a client component.
// dynamic import not required, but keeps the page clearly server -> client separation.
const LoginForm = dynamic(() => import("@/components/forms/LoginForm"), {
  ssr: true,
});

export const metadata = {
  title: "Login - TruckMatch",
};

export default function LoginPage() {
  // This file is a server component by default (no "use client" here).
  // Put any server-only logic (fetch static config, i18n, feature flags) here.
  const brandTitle = "TruckMatch";

  return (
    <div className="min-h-screen flex">
      {/* Left side (static / server rendered) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8">
        <div className="items-center justify-center flex flex-col">
          <Icon
            name="logo"
            className="w-full max-w-[400px] mx-auto mb-4 flex justify-center items-center"
          />
          <h2 className="text-6xl sm:text-3xl text-blackdark mb-2 tracking-wide">
            Truck
            <span className="text-6xl sm:text-3xl font-bold text-primary">
              Match
            </span>
          </h2>
          <p className="mt-4 text-sm text-primarygray max-w-[380px] text-center">
            Manage your fleet, drivers, and jobs efficiently in one place.
          </p>
        </div>
      </div>

      {/* Right side (contains client LoginForm) */}
      <div className="w-full lg:w-1/2 bg-surface flex justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-16">
            <Link href="/">
              <button className="bg-primary text-white rounded-full px-4 py-2 flex items-center gap-2">
                <Icon name="phone" className="w-5 h-5" />
                Contact Us
              </button>
            </Link>
          </div>

          {/* Client-side login form */}
          <LoginForm brandTitle={brandTitle} />

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-primarygray">
              {/* <Link href="/terms">
                <a className="hover:text-primary">Terms & Conditions</a>
              </Link>
              <span className="text-primarygray">•</span>
              <Link href="/privacy">
                <a className="hover:text-primary">Privacy Policy</a>
              </Link>
              <span className="text-primarygray">•</span>
              <Link href="/support">
                <a className="hover:text-primary">Customer Support</a>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
