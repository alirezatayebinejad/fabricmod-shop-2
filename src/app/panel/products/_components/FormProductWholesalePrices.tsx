import RetryError from "@/components/datadisplay/RetryError";
import apiCRUD from "@/services/apiCRUD";
import useSWR from "swr";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { ProductWholesales } from "@/types/apiTypes";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom"; // You must have this or similar component

type Props = {
  onClose?: () => void;
  productId?: number;
  productSlug?: string;
  isModal: boolean;
};

type WholesaleVar = {
  variation_id: number | null;
  count_at: string;
  count_to: string;
  whole_price: string;
  delivery_whole_amount: string;
};

export default function FormProductWholesalePrices({
  onClose,
  productSlug,
  productId,
  isModal = true,
}: Props) {
  const {
    data: wholesaleData,
    error: wholesError,
    isLoading: wholeLoading,
    mutate: mutateWhole,
  } = useSWR(`admin-panel/product/${productId}/whole-sale`, (url: string) =>
    apiCRUD({
      urlSuffix: url,
    }),
  );

  // Get variations for select options
  const product: ProductWholesales | undefined = wholesaleData?.data;
  const variationOptions =
    product?.variations?.map((v) => ({
      id: v.id,
      title: v.value,
      description: v.attribute?.name ? `ویژگی: ${v.attribute.name}` : "",
    })) || [];

  // Prepare initial values for the form
  const initialVars: WholesaleVar[] = product?.whole_sales?.length
    ? product.whole_sales.map((ws) => ({
        variation_id: ws.variation_id,
        count_at: ws.count_at?.toString() ?? "",
        count_to: ws.count_to?.toString() ?? "",
        whole_price: ws.price?.toString() ?? "",
        delivery_whole_amount: ws.delivery_whole_amount?.toString() ?? "",
      }))
    : [
        {
          variation_id: null,
          count_at: "",
          count_to: "",
          whole_price: "",
          delivery_whole_amount: "",
        },
      ];

  const { values, errors, handleSubmit, loading, setValues, setErrors } =
    useMyForm(
      {
        var: initialVars,
      },
      async (formValues) => {
        // Send as array of objects
        const res = await apiCRUD({
          urlSuffix: `admin-panel/product/${productId}/whole-sale`,
          method: "POST",
          updateCacheByTag: `product-${productSlug}`,
          data: {
            var: formValues.var,
            _method: "put",
          },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose?.();
        }
      },
    );

  // Handlers for add/remove
  const handleAddVar = () => {
    setValues((prev: any) => ({
      ...prev,
      var: [
        ...prev.var,
        {
          variation_id: null,
          count_at: "",
          count_to: "",
          whole_price: "",
          delivery_whole_amount: "",
        },
      ],
    }));
  };

  const handleRemoveVar = (idx: number) => {
    setValues((prev: any) => ({
      ...prev,
      var: prev.var.filter((_: any, i: number) => i !== idx),
    }));
  };

  if (wholeLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (wholesError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateWhole();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        {values.var && values.var.length ? (
          values.var.map((item: WholesaleVar, idx: number) => (
            <div
              key={idx}
              className="mb-2 rounded-[8px] border-1 border-border p-3"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between">
                <h4 className="border-r-3 border-accent-4 pr-2 text-lg font-semibold">
                  قیمت عمده {idx + 1}
                </h4>
                <Button
                  type="button"
                  color="danger"
                  className="rounded px-3 py-1 text-xs"
                  onPress={() => handleRemoveVar(idx)}
                >
                  حذف
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <div>
                  <SelectSearchCustom
                    options={variationOptions}
                    isSearchDisable
                    showNoOneOption={false}
                    value={(() => {
                      if (!item.variation_id) return [];
                      const found = variationOptions.find(
                        (opt) => opt.id === item.variation_id,
                      );
                      return found ? [found] : [];
                    })()}
                    onChange={(val: any) => {
                      setValues((prev: any) => {
                        const nextVar = [...prev.var];
                        nextVar[idx] = {
                          ...nextVar[idx],
                          variation_id: val?.[0]?.id ?? null,
                        };
                        return { ...prev, var: nextVar };
                      });
                    }}
                    placeholder="انتخاب متغیر"
                    title="متغیر"
                  />
                  {(errors as any)?.[`var.${idx}.variation_id`] && (
                    <p className="mt-1 text-xs text-destructive-foreground">
                      {(errors as any)[`var.${idx}.variation_id`]}
                    </p>
                  )}
                </div>
                <InputBasic
                  name={`count_at_${idx}`}
                  label="از تعداد"
                  type="number"
                  value={item.count_at}
                  onChange={(e) =>
                    setValues((prev: any) => {
                      const nextVar = [...prev.var];
                      nextVar[idx] = {
                        ...nextVar[idx],
                        count_at: e.target.value,
                      };
                      return { ...prev, var: nextVar };
                    })
                  }
                  errorMessage={(errors as any)?.[`var.${idx}.count_at`]}
                />
                <InputBasic
                  name={`count_to_${idx}`}
                  label="تا تعداد"
                  type="number"
                  value={item.count_to}
                  onChange={(e) =>
                    setValues((prev: any) => {
                      const nextVar = [...prev.var];
                      nextVar[idx] = {
                        ...nextVar[idx],
                        count_to: e.target.value,
                      };
                      return { ...prev, var: nextVar };
                    })
                  }
                  errorMessage={(errors as any)?.[`var.${idx}.count_to`]}
                />
                <InputBasic
                  name={`whole_price_${idx}`}
                  label="قیمت عمده"
                  type="number"
                  value={item.whole_price}
                  onChange={(e) =>
                    setValues((prev: any) => {
                      const nextVar = [...prev.var];
                      nextVar[idx] = {
                        ...nextVar[idx],
                        whole_price: e.target.value,
                      };
                      return { ...prev, var: nextVar };
                    })
                  }
                  errorMessage={(errors as any)?.[`var.${idx}.whole_price`]}
                />
                <InputBasic
                  name={`delivery_whole_amount_${idx}`}
                  label="هزینه ارسال عمده"
                  type="number"
                  value={item.delivery_whole_amount}
                  onChange={(e) =>
                    setValues((prev: any) => {
                      const nextVar = [...prev.var];
                      nextVar[idx] = {
                        ...nextVar[idx],
                        delivery_whole_amount: e.target.value,
                      };
                      return { ...prev, var: nextVar };
                    })
                  }
                  errorMessage={
                    (errors as any)?.[`var.${idx}.delivery_whole_amount`]
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 text-center">
            <p>هیچ قیمت عمده‌ای ثبت نشده است</p>
          </div>
        )}
        <div className="mb-3 flex justify-end">
          <Button
            type="button"
            color="secondary"
            className="rounded px-6 text-[14px] font-[500]"
            onPress={handleAddVar}
          >
            افزودن ردیف جدید
          </Button>
        </div>
        {errors.var && typeof errors.var === "string" && (
          <p className="mb-5 text-destructive-foreground">{errors.var}</p>
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
