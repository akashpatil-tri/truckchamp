// src/components/forms/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input/page";
import Icon from "@/components/common/Icon/page";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { useLoginMutation } from "@/queries/useLoginMutation";

interface Props {
  brandTitle?: string;
}

export default function LoginForm({ brandTitle }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const mutation = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutation.mutateAsync(data);
      // On success, redirect to dashboard (or wherever)
      router.push("/dashboard");
      // src/components/forms/LoginForm.tsx
    } catch (err: unknown) {
      // Show error to user (toast or inline)
      // Simple inline: console + you can set state to show message
      console.error("Login failed:", err);
      // optionally show toast: toast.error(err?.message ?? "Login failed")
    }
  };

  return (
    <div className="rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blackdark mb-2">
          Welcome back to {brandTitle ?? "TruckMatch"}
        </h1>
        <p className="text-primarygray text-sm sm:text-base">
          Manage your fleet, drivers, and jobs efficiently in one place.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blackdark mb-2"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            className={`w-full ${
              errors.email ? "border-red focus:border-red" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-blackdark mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className={`w-full pr-12 ${
                errors.password ? "border-red focus:border-red" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primarygray hover:text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="filled"
          className="w-full bg-primary hover:bg-primary/90 border-primary text-white py-3"
          isLoading={mutation.isPending}
          isDisabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </Button>

        {mutation.isError && (
          <p className="text-red text-sm mt-2">
            {(mutation.error as { message?: string })?.message ??
              "Login failed. Please try again."}
          </p>
        )}
      </form>
    </div>
  );
}
