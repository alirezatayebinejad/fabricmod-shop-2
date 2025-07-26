"use client";
import Image from "next/image";
import React from "react";

export default function PageHeader({
  img,
  title,
  breadCrumb,
}: {
  title?: string;
  img: string;
  breadCrumb?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Image
        src={img}
        alt={title || "header banner image"}
        priority
        width={1250}
        height={250}
        className={"h-auto max-h-[250px] w-full rounded-[12px] object-cover"}
      />
      <div className="absolute right-10 top-[40%] z-10">
        {title && (
          <h1 className="inline rounded-xl bg-white/30 px-3 text-[36px] font-bold drop-shadow-lg max-md:text-[16px]">
            {title}
          </h1>
        )}
        <div className="rounded-xl bg-white/30 px-3">{breadCrumb}</div>
      </div>
    </div>
  );
}
