"use client";
import HeaderCategories from "@/app/panel/categories/_components/HeaderCategories";
import TableCategories from "@/app/panel/categories/_components/TableCategories";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import { useState } from "react";

export default function CategoriesPage() {
    const [type, setType] = useState<"post" | "product">("post"); // Set a default type

  return (
    <main>
      <div className="pages_wrapper">
        <div className="mb-5">
          <Breadcrumb items={[{ title: "پنل" }, { title: "دسته بندی ها" }]} />
        </div>
        <HeaderCategories type={type} setType={setType} />
        <TableCategories />
      </div>
    </main>
  );
}
