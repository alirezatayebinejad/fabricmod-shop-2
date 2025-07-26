import HeaderUsers from "@/app/panel/users/userslist/_components/HeaderUsers";
import TableUsers from "@/app/panel/users/userslist/_components/TableUsers";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function Users() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "کاربر ها" }]} />
        </div>
        <HeaderUsers />
        <TableUsers />
      </div>
    </main>
  );
}
