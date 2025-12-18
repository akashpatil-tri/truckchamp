import dynamic from "next/dynamic";

import AuthLayout from "@layout/AuthLayout";

const LoginForm = dynamic(() => import("@/components/forms/Auth/LoginForm"), {
  ssr: true,
});

export const metadata = {
  title: "Login - TruckMatch",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
