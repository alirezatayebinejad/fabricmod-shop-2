import RetryError from "@/components/datadisplay/RetryError";
import apiCRUD from "@/services/apiCRUD";
import useSWR, { useSWRConfig } from "swr";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { ProductVariationIndex } from "@/types/apiTypes";
import useMyForm from "@/hooks/useMyForm";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useRouter } from "next/navigation";
import InputBasic from "@/components/inputs/InputBasic";
import DatePickerWrapper from "@/components/inputs/DatePickerWrapper";

type Props = {
  onClose?: () => void;
  productSlug?: string;
  isModal: boolean;
  inSiteMode?: boolean;
};

export default function FormProductPrices({
  onClose,
  productSlug,
  isModal = true,
  inSiteMode = false,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const {
    data: variationData,
    error: varError,
    isLoading: varLoading,
    mutate: mutateVar,
  } = useSWR(`admin-panel/product/${productSlug}/variations`, (url) =>
    apiCRUD({
      urlSuffix: url,
    }),
  );
  const variations: ProductVariationIndex[] = variationData?.data;

  const { values, errors, handleSubmit, loading, setValues, setErrors } =
    useMyForm(
      {
        variations: variations
          ? variations.reduce<Record<number, any>>((acc, variation) => {
              acc[variation.id] = {
                value: variation.value || "",
                quantity: variation.quantity || "",
                price: variation.price || "",
                sale_price: variation.sale_price || "",
                date_sale_from: variation.date_sale_from || undefined,
                date_sale_to: variation.date_sale_to || undefined,
                sku: variation.sku || "",
              };
              return acc;
            }, {})
          : undefined,
      },
      async (formValues) => {
        const res = await apiCRUD({
          urlSuffix: `admin-panel/product/variations`,
          method: "POST",
          updateCacheByTag: `product-${productSlug}`,
          data: { ...formValues },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose?.();
          if (!inSiteMode) {
            if (isModal)
              mutate(
                `admin-panel/products${filters ? "?" + filters : filters}`,
              );
            else router.push("/panel/products/lists");
          } else {
            router.refresh();
          }
        }
      },
    );

  if (varLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (varError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateVar();
          }}
        />
      </div>
    );
  }
  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        {values.variations && Object.keys(values.variations).length ? (
          Object.entries(values.variations).map(([id, variation], i) => (
            <div
              key={id}
              className="mb-2 rounded-[8px] border-1 border-border p-3"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between">
                <h4 className="border-r-3 border-accent-4 pr-2 text-lg font-semibold">
                  متغیر {i + 1}
                </h4>
              </div>
              <div className={"grid grid-cols-1 gap-4 md:grid-cols-3"}>
                <InputBasic
                  name={`value_${id}`}
                  label="نام"
                  type="text"
                  value={variation.value}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        value: e.target.value,
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={
                    (errors as any)[`variations.${Number(id)}.value`]
                  }
                />
                <InputBasic
                  name={`sku_${id}`}
                  label="sku"
                  type="text"
                  value={variation.sku}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        sku: e.target.value,
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={(errors as any)[`variations.${Number(id)}.sku`]}
                />
                <InputBasic
                  name={`quantity_${id}`}
                  label="تعداد"
                  type="number"
                  value={variation.quantity}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        quantity: e.target.value,
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={
                    (errors as any)[`variations.${Number(id)}.quantity`]
                  }
                />
                <InputBasic
                  name={`price_${id}`}
                  label="قیمت"
                  type="number"
                  value={variation.price}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        price: e.target.value,
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={
                    (errors as any)[`variations.${Number(id)}.price`]
                  }
                />
                <InputBasic
                  name={`sale_price_${id}`}
                  label="قیمت تخفیف خورده"
                  type="number"
                  value={variation.sale_price}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        sale_price: e.target.value ? e.target.value : "",
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={
                    (errors as any)[`variations.${Number(id)}.sale_price`]
                  }
                />
                <DatePickerWrapper
                  name={`date_sale_from_${id}`}
                  title="شروع فروش"
                  defaultValue={variation.date_sale_from ?? undefined}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        date_sale_from: e ? e : undefined,
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={
                    (errors as any)[`variations.${Number(id)}.date_sale_from`]
                  }
                />
                <DatePickerWrapper
                  name={`date_sale_to_${id}`}
                  title="پایان فروش"
                  defaultValue={variation.date_sale_to ?? undefined}
                  onChange={(e) =>
                    setValues((prev) => {
                      const variations = { ...prev.variations };
                      variations[Number(id)] = {
                        ...variations[Number(id)],
                        date_sale_to: e!,
                      };
                      return {
                        ...prev,
                        variations,
                      };
                    })
                  }
                  errorMessage={
                    (errors as any)[`variations.${Number(id)}.date_sale_to`]
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 text-center">
            <p>متغیری وجود ندارد</p>
          </div>
        )}
        {errors.variations && (
          <p className="mb-5 text-destructive-foreground">
            {errors.variations}
          </p>
        )}
        <div className="mb-3 mt-3 flex justify-end gap-2">
          {isModal && (
            <Button
              type="button"
              className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
              variant="light"
              onPress={onClose}
            >
              بستن
            </Button>
          )}
          <Button
            type="submit"
            isLoading={loading}
            color="primary"
            className="rounded-[8px] px-10 text-[14px] font-[500] text-primary-foreground"
          >
            ذخیره
          </Button>
        </div>
      </form>
    </div>
  );
}
