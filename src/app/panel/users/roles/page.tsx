import HeaderRoles from "@/app/panel/users/roles/_components/HeaderRoles";
import TableRoles from "@/app/panel/users/roles/_components/TableRoles";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function Users() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb
            items={[
              { title: "پنل" },
              { title: "کاربران" },
              { title: "نقش ها" },
            ]}
          />
        </div>
        <HeaderRoles />
        <TableRoles />
      </div>
    </main>
  );
}
