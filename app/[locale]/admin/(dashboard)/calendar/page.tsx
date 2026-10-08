import { requirePageAdmin } from "@/lib/auth-guards";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CalendarManager } from "@/components/admin/calendar-manager";

type Locale = "th" | "en";

export const metadata = {
  title: "Calendar - Maison Ember",
};

export default async function CalendarPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requirePageAdmin(locale);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 tracking-tight">Calendar</h1>
        <p className="mt-2 text-stone-500">View your reservations in a monthly or daily calendar format.</p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
        <CalendarManager />
      </Suspense>
    </div>
  );
}
