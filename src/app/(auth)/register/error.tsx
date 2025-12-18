"use client";

import Link from "next/link";
import AuthLayout from "@layout/AuthLayout";
import Button from "@/components/common/Button";

export default function RegisterErrorPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Registration Token
          </h1>
          <p className="text-gray-600 mb-4">
            The registration token is either invalid, expired, or missing.
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Please check your email for a valid registration link or contact support.
          </p>
          
          
            <Link 
            className="offcanvas-btn-back btn btn-outline"
            href="/login" 
          >
            Go to Login
          </Link>
          
          
        </div>
      </div>
    </AuthLayout>
  );
}