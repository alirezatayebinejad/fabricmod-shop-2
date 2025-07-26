import SettingTabs from "@/app/panel/settings/_components/SettingTabs";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function ProductsPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "تنظیمات" }]} />
        </div>
        <SettingTabs />
      </div>
    </main>
  );
}
