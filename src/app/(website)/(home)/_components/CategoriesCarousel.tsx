"use client";
import CategoryCard from "@/app/(website)/(home)/_components/CategoryCard";
import Carousel from "@/components/datadisplay/Carousel";
import { useGlobalData } from "@/contexts/GlobalData";
import React from "react";

export default function CategoriesCarousel() {
  const gd = useGlobalData();

  // Collect all child categories
  const childCategories =
    gd?.initials?.categories
      ?.filter((cat) => Array.isArray(cat.childs) && cat.childs.length > 0)
      .map((cat) => cat.childs)
      .flat() || [];

  // Collect parent categories that have no childs
  const parentCategoriesWithNoChilds =
    gd?.initials?.categories?.filter(
      (cat) => !Array.isArray(cat.childs) || cat.childs.length === 0,
    ) || [];

  const allCategories = [...childCategories, ...parentCategoriesWithNoChilds];

  return (
    <Carousel
      title="دسته بندي ها"
      cards={allCategories.map((child) => (
        <CategoryCard key={child.id} categ={child} />
      ))}
    />
  );
}
