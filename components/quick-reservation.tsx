"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CalendarDays, ChevronDown, Clock3, UsersRound } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { timeSlots } from "@/data/restaurant";

export function QuickReservation() {
  const router = useRouter();
  const t = useTranslations("home");
  const common = useTranslations("common");
  const reservation = useTranslations("reservation");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");
  const minDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Number(guests) >= 9) { setError(reservation("errors.largeParty")); return; }
    if (!date) { setError(reservation("errors.date")); return; }
    if (date < minDate) { setError(reservation("errors.past")); return; }
    router.push(`/reservations?date=${date}&time=${time}&guests=${guests}`);
  }
  return <form className="quick-booking" onSubmit={submit} noValidate>
    <div className="quick-field"><label htmlFor="quick-date"><CalendarDays size={17} aria-hidden="true" /> {t("date")}</label><input id="quick-date" type="date" value={date} min={minDate} onChange={(e) => { setDate(e.target.value); setError(""); }} required /></div>
    <div className="quick-field"><label htmlFor="quick-time"><Clock3 size={17} aria-hidden="true" /> {t("time")}</label><div className="select-wrap"><select id="quick-time" value={time} onChange={(e) => setTime(e.target.value)}>{timeSlots.map((slot) => <option key={slot}>{slot}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div></div>
    <div className="quick-field"><label htmlFor="quick-guests"><UsersRound size={17} aria-hidden="true" /> {t("guests")}</label><div className="select-wrap"><select id="quick-guests" value={guests} onChange={(e) => setGuests(e.target.value)}>{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{common("guests", { count: i + 1 })}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div></div>
    <div className="quick-submit"><button className="button button-dark" type="submit">{common("findTable")} <ArrowRight size={17} aria-hidden="true" /></button></div>
    {error && <p className="quick-error" role="alert">{error} {Number(guests) >= 9 && <a href={`tel:${common("phone")}`}>{reservation("largePartyLink")}</a>}</p>}
  </form>;
}
