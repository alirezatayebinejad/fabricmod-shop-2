import apiCRUD from "@/services/apiCRUD";
import { useSWRConfig } from "swr";
import { Button } from "@heroui/button";
import { CategoryIndex } from "@/types/apiTypes";
import useMyForm from "@/hooks/useMyForm";
import { useFiltersContext } from "@/contexts/SearchFilters";
import InputBasic from "@/components/inputs/InputBasic";

type Props = {
  onClose?: () => void;
  categ?: CategoryIndex;
  isModal: boolean;
};

export default function FormCategPrice({
  onClose,
  categ,
  isModal = true,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();

  const { values, errors, handleSubmit, loading, setValues, setErrors } =
    useMyForm(
      {
        price: "",
        sale_price: "",
      },
      async (formValues) => {
        const res = await apiCRUD({
          urlSuffix: `admin-panel/category-price/63`,
          method: "POST",
          updateCacheByTag: `productCategory-${categ?.slug}`,
          data: { ...formValues },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose?.();
          mutate(`admin-panel/categories${filters ? "?" + filters : filters}`);
        }
      },
    );

  return (
    <div>
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputBasic
            name="price"
            label="قیمت"
            type="number"
            value={values.price}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                price: e.target.value,
              }))
            }
            errorMessage={errors.price}
          />
          <InputBasic
            name="sale_price"
            label="قیمت تخفیف خورده"
            type="number"
            value={values.sale_price}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                sale_price: e.target.value,
              }))
            }
            errorMessage={errors.sale_price}
          />
        </div>
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
