"use client";
import CategoryCard from "@/app/(website)/(home)/_components/CategoryCard";
import Carousel from "@/components/datadisplay/Carousel";
import { useGlobalData } from "@/contexts/GlobalData";
import React from "react";

export default function CategoriesCarousel() {
  const gd = useGlobalData();

  const childCategories =
    gd?.initials?.categories
      ?.filter((cat) => Array.isArray(cat.childs) && cat.childs.length > 0)
      .map((cat) => cat.childs)
      .flat() || [];
  console.log("c", gd?.initials?.categories);

  return (
    <Carousel
      title="دسته بندي ها"
      cards={childCategories.map((child) => (
        <CategoryCard key={child.id} categ={child} />
      ))}
    />
  );
}
