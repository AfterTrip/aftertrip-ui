import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign up | AfterTrip",
  robots: {
    index: false,
    follow: false
  }
};

export default function SignupPage() {
  return <AuthPage />;
}
