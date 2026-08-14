import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms and Privacy | AfterTrip",
  description:
    "Read AfterTrip's Terms of Service and Privacy Policy for sharing real travel journeys."
};

export default function LegalRoute() {
  return <LegalPage />;
}
