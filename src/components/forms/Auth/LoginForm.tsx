"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Button from "@common/Button";
import Input from "@common/Input";
import { useLoginMutation } from "@queries/auth";

import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { getRoleBasedDashboard } from "@/lib/utils/auth.utils";
import { UserRole } from "@/lib/api/auth/auth.types";

export default function LoginForm() {
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
      const login = await mutation.mutateAsync(data);
      const dashboardRoute = getRoleBasedDashboard(login.role.name as UserRole);
      router.push(dashboardRoute);
    } catch (err: unknown) {
      console.error("Login failed:", err);
    }
  };

  return (
    <>
      <div className="text-center logo-form-wid">
        <h1>
          Welcome back to Truck
          <span className="text-primary">Match</span>
        </h1>
        <p className="mb-0">
          Manage your fleet, drivers, and jobs efficiently in one place.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="logo-form-la logo-form-wid">
          <div className="form-group">
            <label className="form-label">Email Address</label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              inputClass={`form-control border ${errors.email ? "input-error" : ""
                }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-primary form-text mt-2 small"
              >
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Your password</label>
            <div className="password-icon">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                inputClass={`form-control border`}
              />
              <Button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                variant="ghost"
                className="toggle-password"
                ariaLabel={showPassword ? "Hide password" : "Show password"}
                icon={
                  showPassword ? (
                    <EyeOff
                      className="w-5 h-5 text-secondary"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Eye className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  )
                }
              />
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-primary form-text mt-2 small"
                >
                  {errors.password?.message}
                </p>
              )}
            </div>
          </div>
          <div className="text-end">
            <Link href="/forgot-password" className="login-form-forpass-link">
              Forgot your password?
            </Link>
          </div>
        </div>
        <div className="login-form-btn-wrap logo-form-wid">
          <div className="btn-full">
            <Button
              type="submit"
              variant="filled"
              className="w-100"
              isLoading={mutation.isPending}
              isDisabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "Log In"}
            </Button>

            {/* {mutation.isError && (
              <p className="text-primary form-text mt-2 text-center small">
                {(mutation.error as { message?: string })?.message ??
                  "Login failed. Please try again."}
              </p>
            )} */}
          </div>
        </div>
      </form>
      {/* ---------------–––––––––––------------- */}
      {/* <div className="rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blackdark mb-2">
            Welcome back to {brandTitle ?? "TruckMatch"}
          </h1>
          <p className="text-primarygray text-sm sm:text-base">
            Manage your fleet, drivers, and jobs efficiently in one place.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
      </div> */}
    </>
  );
}
