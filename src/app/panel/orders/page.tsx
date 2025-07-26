import HeaderOrders from "@/app/panel/orders/_components/HeaderOrders";
import TableOrders from "@/app/panel/orders/_components/TableOrders";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function BrandsPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "سفارشات" }]} />
        </div>
        <HeaderOrders />
        <TableOrders />
      </div>
    </main>
  );
}
