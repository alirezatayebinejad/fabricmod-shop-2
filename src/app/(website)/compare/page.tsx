"use client";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import InfoBox from "@/components/datadisplay/InfoBox";
import Title from "@/components/datadisplay/Title";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@heroui/button";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useCompare } from "@/contexts/compareContext";
import { CompareIndex } from "@/types/apiTypes";
import { dateConvert } from "@/utils/dateConvert";
import { weight } from "@/constants/staticValues";

export default function ComparePage() {
  const { compares, removeCompare } = useCompare();
  const compareQuery = compares?.map((c, i) => `products[${i}]=${c}`).join("&");
  const { data } = useSWR(
    compareQuery ? `next/compare?${compareQuery}` : null,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const products: CompareIndex[] = data?.data || [];

  const generateTheData = (): TableGenerateData => {
    const headers: React.ReactNode[] = ["ویژگی"];

    products.forEach((product) => {
      headers.push(
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-[150px] w-[150px] flex-col items-center gap-2">
            <Button
              variant="light"
              isIconOnly
              className="absolute -left-10 top-0"
              onClick={() => removeCompare(product.slug)}
            >
              <X className="w-5 text-TextLow" />
            </Button>
            <Image
              src={process.env.NEXT_PUBLIC_IMG_BASE + product.primary_image}
              alt={product.name}
              width={150}
              height={150}
              className="rounded-[10px] object-cover"
            />
          </div>
          <span className="text-TextLow">{product.name}</span>
        </div>,
      );
    });

    const allAttributes = new Set<string>();
    const allVariationNames = new Set<string>();

    products.forEach((product) => {
      product.attributes_value.forEach((attr) => allAttributes.add(attr.name));
      product.variations.forEach((variation) =>
        allVariationNames.add(variation.attribute.name),
      );
    });

    const body = [
      { feature: "نام", values: products.map((p) => p.name) },
      {
        feature: "وزن",
        values: products.map((p) => p.weight.toString() + " " + weight),
      },
      {
        feature: "نوع گارانتی",
        values: products.map((p) =>
          p.garranty_type === "replace"
            ? "تعویض"
            : p.garranty_type === "repair"
              ? "تعمیر"
              : "-",
        ),
      },
      {
        feature: "روزهای گارانتی",
        values: products.map((p) => p.garranty_day.toString()),
      },
      {
        feature: "بررسی موجودی",
        values: products.map((p) => (p.quantity_check ? "موجود" : "ناموجود")),
      },
      {
        feature: "تخفیف خورده",
        values: products.map((p) => (p.sale_check ? "بله" : "خیر")),
      },
      {
        feature: "قیمت",
        values: products.map((p) =>
          p.price_check ? p.price_check.price.toString() : "ناموجود",
        ),
      },
      { feature: "امتیاز", values: products.map((p) => p.rate.toString()) },
      {
        feature: "تاریخ بروزرسانی",
        values: products.map((p) => dateConvert(p.updated_at, "persian")),
      },
      ...Array.from(allAttributes).map((attr) => ({
        feature: attr,
        values: products.map((p) => {
          const foundAttr = p.attributes_value.find((a) => a.name === attr);
          return foundAttr ? foundAttr.pivot.value : "-";
        }),
      })),
      ...Array.from(allVariationNames).map((variationName) => ({
        feature: variationName,
        values: products.map((p) => {
          const foundVariation = p.variations.find(
            (v) => v.attribute.name === variationName,
          );
          return foundVariation ? foundVariation.value : "-";
        }),
      })),
    ];

    return {
      headers: headers.map((i) => ({
        content: i,
      })),
      body: body.map(({ feature, values }) => ({
        cells: [
          {
            data: feature,
            className: "text-sm font-bold",
          },
          ...values.map((v) => ({
            data: <div className="flex justify-center py-3">{v}</div>,
            className: "text-sm",
          })),
        ],
      })),
    };
  };

  return (
    <main>
      <div className="mt-5">
        <Breadcrumb
          items={[{ title: "خانه", link: "/" }, { title: "مقایسه محصولات" }]}
        />
        <Title
          title="مقایسه محصولات"
          styles={{ container: "items-start ", title: "text-[38px] font-bold" }}
        />
        <InfoBox content="برای استفاده از این قابلیت در فروشگاه محصولات را به لیست مقایسه اضاف کنید" />

        <div>
          <TableGenerate data={generateTheData()} />
        </div>
      </div>
    </main>
  );
}
