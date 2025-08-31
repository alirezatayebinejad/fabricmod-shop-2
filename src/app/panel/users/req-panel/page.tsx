import TableUsersWholesales from "@/app/panel/users/req-panel/_components/TableUsersWholesales";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function Users() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "کاربر ها" }]} />
        </div>
        <TableUsersWholesales />
      </div>
    </main>
  );
}
