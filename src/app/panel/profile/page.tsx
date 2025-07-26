import FormProfile from "@/app/panel/profile/_components/FormProfile";
import HeaderProfile from "@/app/panel/profile/_components/HeaderProfile";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";

export default function Profile() {
  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "پروفایل" }]} />
        </div>
        <HeaderProfile />
        <FormProfile />
      </div>
    </main>
  );
}
