import { setRequestLocale } from "next-intl/server";
import { requirePageAdmin } from "@/lib/auth-guards";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminDashboardLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePageAdmin(locale);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--admin-bg)" }}>
      <AdminSidebar />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen overflow-x-hidden p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
