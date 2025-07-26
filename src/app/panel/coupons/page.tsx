import HeaderCoupons from "@/app/panel/coupons/_components/HeaderCoupons";
import TableCoupons from "@/app/panel/coupons/_components/TableCoupons";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function PagesPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "کد تخفیف ها" }]} />
        </div>
        <HeaderCoupons />
        <TableCoupons />
      </div>
    </main>
  );
}
