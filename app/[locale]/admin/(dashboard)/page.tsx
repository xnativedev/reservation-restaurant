import { requirePageAdmin } from "@/lib/auth-guards";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { DashboardOverview } from "@/components/admin/dashboard-overview";

type Locale = "th" | "en";

export const metadata = {
  title: "Dashboard - Maison Ember",
  description: "Restaurant Management Dashboard",
};

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requirePageAdmin(locale);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 tracking-tight">Today&apos;s Overview</h1>
        <p className="mt-2 text-stone-500">At a glance view of Maison Ember&apos;s reservations and metrics.</p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
        <DashboardOverview />
      </Suspense>
    </div>
  );
}
