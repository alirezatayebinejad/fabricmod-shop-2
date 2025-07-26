import HeaderPages from "@/app/panel/pages/_components/HeaderPages";
import TablePages from "@/app/panel/pages/_components/TablePages";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function PagesPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "صفحه ها" }]} />
        </div>
        <HeaderPages />
        <TablePages />
      </div>
    </main>
  );
}
