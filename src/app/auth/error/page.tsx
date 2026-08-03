import type { Metadata } from "next";
import ErrorClient from "./ErrorClient";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Sign-in error", robots: { index: false, follow: false } };

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorClient />
    </Suspense>
  );
}
