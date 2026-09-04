import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Curator Panel",
};

export default function AdminDashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-[#F5F5F7] lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-6 py-10 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
