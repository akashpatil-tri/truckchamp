"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Button from "@common/Button";
import Input from "@common/Input";

import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/schemas/auth.schema";
import { useResetPasswordMutation } from "@/queries/auth";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const mutation = useResetPasswordMutation();

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      await mutation.mutateAsync({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      router.push("/login");
    } catch (err: unknown) {
      console.error("Reset password failed:", err);
    }
  };

  return (
    <>
      <div className="text-center logo-form-wid">
        <h1>Set Password</h1>
        {/* <p className="mb-0">
          Provide your email and we&apos;ll send you a secure link to reset your
          password. Quick, safe, and back on the road in minutes.
        </p> */}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="logo-form-la logo-form-wid">
          <div className="form-group">
            <label className="form-label">Password</label>

            <Input
              id="password"
              type="text"
              placeholder="12345"
              {...register("password")}
              inputClass={`form-control border ${
                errors.password ? "input-error" : ""
              }`}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>

            <Input
              id="password"
              type="text"
              placeholder="12345"
              {...register("confirmPassword")}
              inputClass={`form-control border ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={
                errors.confirmPassword ? "password-error" : undefined
              }
            />
            {errors.confirmPassword && (
              <p
                id="password-error"
                role="alert"
                className="text-primary form-text mt-2 small"
              >
                {errors.confirmPassword?.message}
              </p>
            )}
          </div>
        </div>
        <div className="login-form-btn-wrap login-cform-btn-wrap">
          <div className="bck-login-btn-wrap">
            <Button
              as="link"
              href="/login"
              variant="outline"
              className="bck-btn bg-white text-black border-dark"
              icon={
                <span className="me-2">
                  <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </span>
              }
              iconPosition="left"
            >
              Back to login
            </Button>
          </div>
          <div className="send-reset-btn-wrap">
            <Button
              type="submit"
              variant="filled"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Set Password"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
