import HeaderCategories from "@/app/panel/categories/_components/HeaderCategories";
import TableCategories from "@/app/panel/categories/_components/TableCategories";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function CategoriesPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "دسته بندی ها" }]} />
        </div>
        <HeaderCategories />
        <TableCategories />
      </div>
    </main>
  );
}
