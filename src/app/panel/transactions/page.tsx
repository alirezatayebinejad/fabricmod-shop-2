import HeaderTransactions from "@/app/panel/transactions/_components/HeaderTransactions";
import TableTransactions from "@/app/panel/transactions/_components/TableTransactions";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function BrandsPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "سفارشات" }]} />
        </div>
        <HeaderTransactions />
        <TableTransactions />
      </div>
    </main>
  );
}
