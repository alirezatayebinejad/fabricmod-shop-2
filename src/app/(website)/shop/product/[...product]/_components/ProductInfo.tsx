"use client";
import ActionBtns from "@/app/(website)/shop/product/[...product]/_components/ActionBtns";
import FeaturesSelect from "@/app/(website)/shop/product/[...product]/_components/FeaturesSelect";
import FormProductPrices from "@/app/panel/products/_components/FormProductPrices";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import GenerateStarIcons from "@/components/snippets/GenerateStars";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { currency } from "@/constants/staticValues";
import { useUserContext } from "@/contexts/UserContext";
import { ProductShowSite } from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { DollarSign, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductInfo({ data }: { data: ProductShowSite }) {
  const { user } = useUserContext();
  const priceModal = useDisclosure();
  const [selectedVariation, setSelectedVariation] = useState<
    ProductShowSite["variations"][number] | undefined
  >(undefined);
  const isAdmin = user?.roles.some(
    (r) => r.name === "admin" || r.name === "super_admin",
  );

  useEffect(() => {
    if (data) {
      const defaultVariationBasedOnPriceCheck = data.variations?.find(
        (v) =>
          data.price_check && v.attribute_id === data.price_check?.attribute_id,
      );
      setSelectedVariation(defaultVariationBasedOnPriceCheck);
    }
  }, [data]);

  return (
    <div className="sticky top-0">
      <RevealEffect
        mode="customFadeUp"
        options={{ triggerOnce: true, cascade: true, damping: 0.2 }}
      >
        <div className="flex items-center gap-1">
          <h1 className="mb-5 text-[28px] font-bold">{data.name}</h1>
          {isAdmin && (
            <div>
              <Button
                as={Link}
                href={`/panel/products/edit/${data.id}`}
                size="sm"
                prefetch={false}
                target="_blank"
                className="mb-5 flex h-6 min-h-0 cursor-pointer gap-1 rounded-md bg-gradient-to-tl from-accent-1 to-accent-2 px-1 !text-TextSize200 text-accent-1-foreground"
              >
                <Pencil className="w-3 text-accent-1-foreground" /> ویرایش محصول
              </Button>
            </div>
          )}
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <GenerateStarIcons rate={data.rate} maxRate={5} />
            <p className="text-TextSize300 text-TextMute">
              امتیاز کاربران {data.rate}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 text-TextMute" />
            <p className="text-TextSize300 text-TextMute">
              {data.views_count} بازدید
            </p>
          </div>
        </div>
        <div className="text-[32px]">
          {selectedVariation?.sale_price ? (
            <div>
              <span className="text-TextSize500 line-through">
                {formatPrice(selectedVariation.price)} {currency}
              </span>
              <span className="block text-TextColor">
                {formatPrice(selectedVariation.sale_price)} {currency}
              </span>
            </div>
          ) : null}
          {!selectedVariation?.sale_price && (
            <span>
              {selectedVariation?.price
                ? formatPrice(selectedVariation?.price) + " " + currency
                : ""}{" "}
            </span>
          )}
        </div>
        {isAdmin && (
          <div>
            <Button
              onPress={() => {
                priceModal.onOpen();
              }}
              size="sm"
              className="mb-5 flex h-6 min-h-0 cursor-pointer gap-1 rounded-md bg-gradient-to-tl from-accent-1 to-accent-2 px-1 text-TextSize200 text-accent-1-foreground"
            >
              <DollarSign className="w-3 text-accent-1-foreground" /> تغییر قیمت
              ها
            </Button>
            <ModalWrapper
              disclosures={{
                onOpen: priceModal.onOpen,
                onOpenChange: priceModal.onOpenChange,
                isOpen: priceModal.isOpen,
              }}
              size="5xl"
              isDismissable
              modalHeader={<h2>قیمت گزاری محصول {data?.name}</h2>}
              modalBody={
                <FormProductPrices
                  onClose={() => priceModal.onClose()}
                  isModal
                  inSiteMode={true}
                  productSlug={data?.slug}
                />
              }
            />
          </div>
        )}
        <p className="mt-6 overflow-hidden border-t-1 border-border pt-6 text-TextSize500 text-TextLow">
          {data.description}
        </p>
        <div className="my-8">
          <FeaturesSelect
            product={data}
            selectedVariation={selectedVariation}
            onVariationChange={(v) => setSelectedVariation(v)}
          />
        </div>
        <div>
          <ActionBtns product={data} selectedVariation={selectedVariation} />
        </div>
        <div className="mt-9 flex flex-col gap-2">
          <div className="flex flex-wrap gap-7 max-md:gap-3">
            <h5 className="text-TextSize400 text-TextLow">شناسه (SKU)</h5>
            <p className="text-TextSize400 text-TextLow">
              {selectedVariation?.sku}
            </p>
          </div>
          <div className="flex flex-wrap gap-7 max-md:gap-3">
            <h5 className="text-TextSize400 text-TextLow">دسته‌بندی‌</h5>
            <p className="text-TextSize400 text-TextLow">
              {data.category.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-7 max-md:gap-3">
            <h5 className="text-TextSize400 text-TextLow">برچسب‌ها</h5>
            <p className="text-TextSize400 text-TextLow">
              {data.tags.map((tag) => tag.name).join(", ")}
            </p>
          </div>
        </div>
      </RevealEffect>
    </div>
  );
}
