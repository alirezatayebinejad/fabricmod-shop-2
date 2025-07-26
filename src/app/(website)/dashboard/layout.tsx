import DashboardSidebar from "@/app/(website)/dashboard/_components/DashboardSidebar";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="mt-7">
        <Breadcrumb
          items={[{ title: "خانه", link: "/" }, { title: "حساب کاربری" }]}
        />
        <h1 className="mb-8 text-[42px] font-bold max-md:text-[30px]">
          حساب کاربری من
        </h1>
      </div>
      <div className="m-[0_auto] flex max-w-[2000px] gap-[40px]">
        <div className="flex-[0.25] max-md:hidden">
          <DashboardSidebar />
        </div>
        <div className="max-w-[93vw] flex-[0.75] max-md:flex-1">{children}</div>
      </div>
    </main>
  );
}
