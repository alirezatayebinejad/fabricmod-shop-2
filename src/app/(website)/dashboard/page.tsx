import ActiveTab from "@/app/(website)/dashboard/_components/ActiveTab";
import { Suspense } from "react";
export default function DashboardPage() {
  return (
    <div>
      <Suspense>
        <ActiveTab />
      </Suspense>
    </div>
  );
}
