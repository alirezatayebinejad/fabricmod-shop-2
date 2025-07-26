import { LayoutDashboard } from "lucide-react";

export default function SidebarHeader() {
  return (
    <div className="max-md:pb-3 md:p-[16px]">
      <section>
        <div className="flex items-center justify-between">
          <div className="my-4 mr-4 flex items-center gap-3">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[20px] bg-primary-50">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[15px] bg-primary-50">
                <LayoutDashboard className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h1>پنل مدیریت</h1>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
