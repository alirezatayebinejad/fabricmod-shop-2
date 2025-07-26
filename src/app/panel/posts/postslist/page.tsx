import HeaderPost from "@/app/panel/posts/_components/HeaderPost";
import TablePosts from "@/app/panel/posts/_components/TablePosts";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default async function Posts() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "پست ها" }]} />
        </div>
        <HeaderPost />
        <TablePosts />
      </div>
    </main>
  );
}
