import HeaderBanners from "@/app/panel/banners/_components/HeaderBanners";
import TableBanners from "@/app/panel/banners/_components/TableBanners";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function BannersPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "بنر ها" }]} />
        </div>

        <HeaderBanners />
        <TableBanners />
      </div>
    </main>
  );
}
