import HeaderProducts from "@/app/panel/products/_components/HeaderProducts";
import TableProducts from "@/app/panel/products/_components/TableProducts";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function ProductsPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "محصولات" }]} />
        </div>
        <HeaderProducts />
        <TableProducts />
      </div>
    </main>
  );
}
