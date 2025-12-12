"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input/page";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { useLoginMutation } from "@/queries/useLoginMutation";

export default function LoginForm() {
  const router = useRouter();

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

      router.push("/dashboard");
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
              inputClass={`form-control border ${
                errors.email ? "input-error" : ""
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-primary form-text mt-2 text-center small"
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
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                inputClass={`form-control border`}
              />

              <i className="fa fa-regular fa-eye-slash toggle-password"></i>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-primary form-text mt-2 text-center small"
                >
                  {errors.password?.message}
                </p>
              )}
            </div>
          </div>
          <div className="text-end">
            <a href="forgot.html" className="login-form-forpass-link">
              Forgot your password?
            </a>
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

            {mutation.isError && (
              <p className="text-primary form-text mt-2 text-center small">
                {(mutation.error as { message?: string })?.message ??
                  "Login failed. Please try again."}
              </p>
            )}
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
