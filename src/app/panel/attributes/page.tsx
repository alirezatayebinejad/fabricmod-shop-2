import HeaderAttributes from "@/app/panel/attributes/_components/HeaderAttributes";
import TableAttributes from "@/app/panel/attributes/_components/TableAttributes";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function AttributesPage() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "ویژگی ها" }]} />
        </div>
        <HeaderAttributes />
        <TableAttributes />
      </div>
    </main>
  );
}
