"use client";

import { LogoutButton } from "@/components/account/logout-button";
import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CalendarDays, Map, Table2, Users, BarChart3, Settings, UtensilsCrossed, Menu, X } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const locale = (params?.locale as string) || "th";
  
  const navItems = [
    { name: "Dashboard", href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: "Reservations", href: `/${locale}/admin/reservations`, icon: Calendar },
    { name: "Calendar", href: `/${locale}/admin/calendar`, icon: CalendarDays },
    { name: "Floor Plan", href: `/${locale}/admin/floor-plan`, icon: Map },
    { name: "Tables", href: `/${locale}/admin/tables`, icon: Table2 },
    { name: "Customers", href: `/${locale}/admin/customers`, icon: Users },
    { name: "Analytics", href: `/${locale}/admin/analytics`, icon: BarChart3 },
    { name: "Settings", href: `/${locale}/admin/settings`, icon: Settings },
  ];


  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-stone-200 z-40 flex items-center justify-between px-4" style={{ background: "var(--admin-bg)" }}>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-amber-500" />
          <span className="font-medium tracking-wider text-sm">MAISON EMBER</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-stone-600">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-stone-900/50 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-stone-200 flex flex-col h-screen z-50 transition-transform duration-300 ease-in-out ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`} style={{ background: "var(--admin-bg)" }}>
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-stone-200">
        <div className="flex items-center gap-3 text-stone-900">
          <UtensilsCrossed className="w-6 h-6 text-amber-500" />
          <div>
            <h1 className="font-medium text-lg tracking-wider">MAISON EMBER</h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${locale}/admin` && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group ${
                isActive 
                  ? "bg-amber-500/10 text-amber-500 font-medium" 
                  : "text-stone-500 hover:bg-stone-800/5 hover:text-stone-800"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-amber-500" : "text-stone-400 group-hover:text-stone-700 transition-colors"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-stone-200">
        <Link href={`/${locale}/account`} className="flex items-center gap-3 px-4 py-3 text-sm text-stone-600">{locale === "th" ? "บัญชีของฉัน" : "My account"}</Link>
        <LogoutButton />
      </div>
      </aside>
    </>
  );
}
