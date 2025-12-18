"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "@common/Button";
import Input from "@common/Input";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/schemas/auth.schema";
import { useForgotPasswordMutation } from "@/queries/auth";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const mutation = useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await mutation.mutateAsync(data.email);
    } catch (err: unknown) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <>
      <div className="text-center logo-form-wid">
        <h1>Forgot Password</h1>
        <p className="mb-0">
          Provide your email and we&apos;ll send you a secure link to reset your
          password. Quick, safe, and back on the road in minutes.
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
                className="text-primary form-text mt-2 small"
              >
                {errors.email?.message}
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
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
