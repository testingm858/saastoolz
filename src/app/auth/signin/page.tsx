import type { Metadata } from "next";
import SignInClient from "./SignInClient";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

const PLACEHOLDER_IDS = new Set(["placeholder", "placeholder_add_yours", ""]);

export default function SignInPage() {
  const googleConfigured =
    !!process.env.GOOGLE_CLIENT_ID &&
    !!process.env.GOOGLE_CLIENT_SECRET &&
    !PLACEHOLDER_IDS.has(process.env.GOOGLE_CLIENT_ID) &&
    !PLACEHOLDER_IDS.has(process.env.GOOGLE_CLIENT_SECRET);

  return <SignInClient googleConfigured={googleConfigured} />;
}
