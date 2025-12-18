import dynamic from "next/dynamic";

import AuthLayout from "@layout/AuthLayout";

const ForgotPasswordForm = dynamic(
  () => import("@/components/forms/Auth/ForgotPasswordForm"),
  {
    ssr: true,
  }
);

export const metadata = {
  title: "Forgot Password - TruckMatch",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
