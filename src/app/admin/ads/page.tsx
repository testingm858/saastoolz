import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import prisma from "@/lib/prisma";
import AdsAdminClient from "./AdsAdminClient";

export const metadata: Metadata = { title: "Ads Admin", robots: { index: false, follow: false } };

export default async function AdsAdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) redirect("/auth/signin?callbackUrl=/admin/ads");
  if (!isAdminEmail(email)) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Not authorized</h1>
        <p className="text-gray-500 text-sm">This page is restricted to admin accounts.</p>
      </div>
    );
  }

  const slots = await prisma.adSlot.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <AdsAdminClient
      initialSlots={slots.map((s) => ({ ...s, createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString() }))}
    />
  );
}
