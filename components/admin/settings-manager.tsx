"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Save, Store, Shield, Clock, Bell, CheckCircle2 } from "lucide-react";
import { restaurant } from "@/data/restaurant";

// --- Shared primitives -------------------------------------------------------

type ToggleRowProps = {
  label: string;
  description: string;
  defaultChecked?: boolean;
};

function ToggleRow({ label, description, defaultChecked = true }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-stone-200 rounded-xl">
      <div>
        <p className="font-medium text-stone-900">{label}</p>
        <p className="text-sm text-stone-500 mt-1">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
      </label>
    </div>
  );
}

// --- Shared field styles -----------------------------------------------------

const inputClass = "w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all";
const selectClass = `${inputClass} sm:w-64`;

// --- Tab definitions ---------------------------------------------------------

type TabId = "general" | "booking" | "notifications" | "security";

// --- Component ---------------------------------------------------------------

export function SettingsManager() {
  const t = useTranslations("adminSettings");
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: persist settings via API
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "general",       label: t("tabGeneral"),       icon: Store  },
    { id: "booking",       label: t("tabBooking"),       icon: Clock  },
    { id: "notifications", label: t("tabNotifications"), icon: Bell   },
    { id: "security",      label: t("tabSecurity"),      icon: Shield },
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex flex-col lg:flex-row gap-8">

      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0">
        <nav className="space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                activeTab === id
                  ? "bg-amber-500/10 text-amber-600"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <form onSubmit={handleSave} className="bg-white border border-stone-200 shadow-sm rounded-2xl overflow-hidden">

          <div className="p-6 sm:p-8 border-b border-stone-100">

            {/* General */}
            {activeTab === "general" && (
              <div>
                <h3 className="text-lg font-medium text-stone-900 mb-6">{t("tabGeneral")}</h3>
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">{t("fieldName")}</label>
                      <input type="text" defaultValue={restaurant.name} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">{t("fieldPhone")}</label>
                      <input type="text" defaultValue={restaurant.phone} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t("fieldEmail")}</label>
                    <input type="email" defaultValue={restaurant.email} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t("fieldAddress")}</label>
                    <textarea rows={3} defaultValue={restaurant.address} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Booking */}
            {activeTab === "booking" && (
              <div>
                <h3 className="text-lg font-medium text-stone-900 mb-6">{t("tabBooking")}</h3>
                <div className="space-y-6 max-w-2xl">
                  <ToggleRow
                    label={t("bookingOnlineLabel")}
                    description={t("bookingOnlineDesc")}
                  />
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t("bookingMaxParty")}</label>
                    <select defaultValue="8 Guests" className={selectClass}>
                      <option>4 Guests</option>
                      <option>6 Guests</option>
                      <option>8 Guests</option>
                      <option>10 Guests</option>
                      <option>12 Guests</option>
                    </select>
                    <p className="text-xs text-stone-500 mt-2">{t("bookingMaxPartyHint")}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t("bookingAdvance")}</label>
                    <select defaultValue="30 Days in advance" className={selectClass}>
                      <option>14 Days in advance</option>
                      <option>30 Days in advance</option>
                      <option>60 Days in advance</option>
                      <option>90 Days in advance</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div>
                <h3 className="text-lg font-medium text-stone-900 mb-6">{t("tabNotifications")}</h3>
                <div className="space-y-4 max-w-2xl">
                  <ToggleRow
                    label={t("notifNewLabel")}
                    description={t("notifNewDesc")}
                  />
                  <ToggleRow
                    label={t("notifCancelLabel")}
                    description={t("notifCancelDesc")}
                  />
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div>
                <h3 className="text-lg font-medium text-stone-900 mb-6">{t("tabSecurity")}</h3>
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-900 text-sm">{t("securityTitle")}</p>
                      <p className="text-sm text-stone-600 mt-1">{t("securityDesc")}</p>
                    </div>
                  </div>
                  <Link href="/account" className="button button-dark">{t("securityLink")}</Link>
                </div>
              </div>
            )}

          </div>

          <div className="bg-stone-50/50 p-6 sm:p-8 flex items-center justify-end gap-4">
            {saved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t("savedMessage")}
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-amber-500 text-stone-900 font-medium rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? t("saving") : t("save")}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}