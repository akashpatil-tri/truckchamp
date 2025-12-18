import AuthLayout from "@layout/AuthLayout";

import ResetPasswordForm from "@/components/forms/Auth/ResetPassword";
import { authService } from "@/lib/api/auth/auth.service";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    throw new Error("Missing registration token");
  }

  await authService.validateToken(token);

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}

export const metadata = {
  title: "Complete Registration",
  description: "Complete your registration by setting up your password",
};
