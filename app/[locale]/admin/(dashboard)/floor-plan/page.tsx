import { requirePageAdmin } from "@/lib/auth-guards";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { FloorPlan } from "@/components/admin/floor-plan";

type Locale = "th" | "en";

export const metadata = {
  title: "Floor Plan - Maison Ember",
};

export default async function FloorPlanPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requirePageAdmin(locale);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 tracking-tight">Floor Plan</h1>
        <p className="mt-2 text-stone-500">Visual mapping of restaurant zones and real-time table status.</p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
        <FloorPlan />
      </Suspense>
    </div>
  );
}
