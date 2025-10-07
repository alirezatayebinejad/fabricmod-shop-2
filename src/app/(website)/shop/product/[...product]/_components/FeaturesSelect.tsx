"use client";
import { ProductShowSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";

const FeaturesSelect = ({
  product,
  onVariationChange,
  selectedVariation,
}: {
  product: ProductShowSite;
  onVariationChange: (variation: ProductShowSite["variations"][number]) => void;
  selectedVariation: ProductShowSite["variations"][number] | undefined;
}) => {
  const handleSelect = (variation: ProductShowSite["variations"][number]) => {
    onVariationChange(variation);
  };

  return (
    <div>
      {product?.variations.length > 1 && (
        <div>
          <h4 className="mb-3">{product?.variations?.[0]?.attribute?.name}</h4>
          <div className="flex flex-wrap gap-3">
            {product?.variations?.map((v) => {
              const isSelected = selectedVariation?.id === v.id;
              return (
                <Button
                  key={v.id}
                  size="sm"
                  className={`flex h-7 cursor-pointer rounded-[2px] px-1 ${isSelected ? "bg-primary" : "bg-boxBg300"}`}
                  onPress={() => handleSelect(v)}
                >
                  <p
                    className={`text-TextSize500 ${isSelected ? `text-primary-foreground` : "text-TextColor"}`}
                  >
                    {v.value}
                  </p>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {product?.attributes_value?.map((a) => (
        <div className="mt-5" key={a.id}>
          <h4 className="mb-3">
            {a.name}: <span className="font-bold">{a.pivot.value}</span>
          </h4>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSelect;
