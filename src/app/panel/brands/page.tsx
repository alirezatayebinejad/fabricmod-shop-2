import HeaderBrands from "@/app/panel/brands/_components/HeaderBrands";
import TableBrands from "@/app/panel/brands/_components/TableBrands";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function BrandsPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "برند ها" }]} />
        </div>
        <HeaderBrands />
        <TableBrands />
      </div>
    </main>
  );
}
