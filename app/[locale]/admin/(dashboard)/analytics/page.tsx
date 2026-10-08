import { requirePageAdmin } from "@/lib/auth-guards";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

type Locale = "th" | "en";

export const metadata = {
  title: "Analytics - Maison Ember",
};

export default async function AnalyticsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requirePageAdmin(locale);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 tracking-tight">Business Analytics</h1>
        <p className="mt-2 text-stone-500">Track restaurant performance, booking trends, and zone utilization.</p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}
