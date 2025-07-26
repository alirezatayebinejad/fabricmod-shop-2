import HeaderShipping from "@/app/panel/shippings/_components/HeaderShipping";
import TableShipping from "@/app/panel/shippings/_components/TableShipping";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function PagesPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "روش های ارسال" }]} />
        </div>
        <HeaderShipping />
        <TableShipping />
      </div>
    </main>
  );
}
