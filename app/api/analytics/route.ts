import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-guards";
import { apiError } from "@/lib/api";
import { Reservation } from "@/models/Reservation";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    await connectToDatabase();
    const allReservations = await Reservation.find({}).lean();
    
    if (allReservations.length === 0) {
      return NextResponse.json({ success: true, data: { empty: true } });
    }

    const total = allReservations.length;
    let cancelled = 0;
    let noShow = 0;
    let totalGuests = 0;
    const zoneCounts: Record<string, number> = { "dining-room": 0, "terrace": 0, "chefs-counter": 0 };
    const zoneGuests: Record<string, number> = { "dining-room": 0, "terrace": 0, "chefs-counter": 0 };
    const timeCounts: Record<string, number> = {};
    const dayCounts: Record<string, number> = {};

    allReservations.forEach((res) => {
      if (res.status === "cancelled") cancelled++;
      if (res.status === "no-show") noShow++;
      if (res.status !== "cancelled" && res.status !== "no-show") {
        totalGuests += res.guests;
        
        // Zone
        if (zoneCounts[res.seatingOption] !== undefined) {
          zoneCounts[res.seatingOption]++;
          zoneGuests[res.seatingOption] += res.guests;
        }

        // Time (Peak hours)
        timeCounts[res.time] = (timeCounts[res.time] || 0) + 1;

        // Day of week
        const dateObj = new Date(res.date);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
      }
    });

    const validReservations = total - cancelled - noShow;
    
    // Sort times to find peak
    const sortedTimes = Object.entries(timeCounts).sort((a, b) => b[1] - a[1]);
    const peakTime = sortedTimes.length > 0 ? sortedTimes[0][0] : "N/A";

    const data = {
      empty: false,
      overview: {
        totalBookings: total,
        validBookings: validReservations,
        avgPartySize: validReservations > 0 ? (totalGuests / validReservations).toFixed(1) : 0,
        cancellationRate: ((cancelled / total) * 100).toFixed(1),
        noShowRate: ((noShow / total) * 100).toFixed(1),
        peakTime
      },
      zones: {
        counts: zoneCounts,
        guests: zoneGuests
      },
      times: timeCounts,
      days: dayCounts
    };

    return NextResponse.json({ success: true, data });
  } catch (error) { return apiError(error); }
}
