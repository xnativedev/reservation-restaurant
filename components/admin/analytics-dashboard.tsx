"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Clock, Map, CalendarDays, Ban } from "lucide-react";

type AnalyticsData = { empty: true } | {
  empty: false;
  overview: { totalBookings: number; validBookings: number; avgPartySize: string | number; cancellationRate: string; noShowRate: string; peakTime: string };
  zones: { counts: Record<string, number>; guests: Record<string, number> };
  times: Record<string, number>;
  days: Record<string, number>;
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics", { signal: controller.signal })
      .then((response) => response.json())
      .then((result) => { if (result.success) setData(result.data); })
      .catch((error) => { if (!controller.signal.aborted) console.error("Failed to load dashboard data", error); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || data.empty) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-white border border-stone-200 rounded-2xl">
        <BarChart3 className="w-12 h-12 text-stone-300 mb-4" />
        <h3 className="text-lg font-medium text-stone-900">Not enough data</h3>
        <p className="text-stone-500 mt-2">Analytics will appear here once reservations are made.</p>
      </div>
    );
  }

  const { overview, zones, days } = data;
  // Prepare simple CSS bar chart data for Zones
  const maxZoneCount = Math.max(...Object.values(zones.counts as Record<string, number>), 1);
  const zoneLabels: Record<string, string> = { "dining-room": "Dining Room", "terrace": "Terrace", "chefs-counter": "Chef's Counter" };

  // Day order
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const maxDayCount = Math.max(...Object.values(days as Record<string, number>), 1);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out space-y-8">

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Total Bookings</span>
          </div>
          <span className="text-3xl font-light text-stone-900">{overview.totalBookings}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Avg Party Size</span>
          </div>
          <span className="text-3xl font-light text-stone-900">{overview.avgPartySize} <span className="text-sm text-stone-500">pax</span></span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Peak Hour</span>
          </div>
          <span className="text-3xl font-light text-stone-900">{overview.peakTime}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Ban className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">Cancel Rate</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-light text-red-500">{overview.cancellationRate}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zone Utilization */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-stone-400" /> Zone Utilization
          </h3>
          <div className="space-y-5">
            {Object.entries(zones.counts).map(([zone, count]) => {
              const numCount = count as number;
              const percentage = (numCount / maxZoneCount) * 100;
              return (
                <div key={zone}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-stone-700 font-medium">{zoneLabels[zone]}</span>
                    <span className="text-stone-500">{numCount} bookings ({zones.guests[zone]} guests)</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Days */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-stone-400" /> Popular Days
          </h3>
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            {dayOrder.map(day => {
              const count = days[day] || 0;
              const percentage = maxDayCount > 0 ? (count / maxDayCount) * 100 : 0;

              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-xs text-stone-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                  <div className="w-full bg-stone-100 rounded-t-sm relative flex-1 flex items-end justify-center">
                    <div
                      className="w-full bg-stone-800 rounded-t-sm transition-all duration-1000 hover:bg-amber-500"
                      style={{ height: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-stone-500">{day.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
