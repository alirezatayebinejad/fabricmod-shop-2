import { Button } from "@heroui/button";
import { useSWRConfig } from "swr";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import { ShippingmethodIndex, ShippingmethodShow } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import { currency } from "@/constants/staticValues";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: ShippingmethodIndex;
};

export default function FormShipping({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();

  const shipping: ShippingmethodShow | undefined = selectedData;

  const { values, errors, loading, handleChange, handleSubmit, setErrors } =
    useMyForm(
      {
        name: shipping?.name,
        code: shipping?.code,
        is_active: shipping?.is_active,
        description: shipping?.description,
        base_cost: shipping?.base_cost,
        per_weight_cost: shipping?.per_weight_cost,
        per_km_cost: shipping?.per_km_cost,
      },
      async (formValues) => {
        const res = await apiCRUD({
          urlSuffix: `admin-panel/shipping-methods${isEditMode ? `/${selectedData?.id}` : ""}`,
          method: "POST",
          data: { ...formValues, _method: isEditMode ? "put" : "post" },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose();
          mutate(
            `admin-panel/shipping-methods${filters ? "?" + filters : filters}`,
          );
        }
      },
    );

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBasic
          name="name"
          label="نام"
          value={values.name}
          onChange={handleChange("name")}
          errorMessage={errors.name}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="code"
          label="کد"
          value={values.code}
          onChange={handleChange("code")}
          errorMessage={errors.code}
          isDisabled={isShowMode}
        />

        <InputBasic
          name="base_cost"
          label={"هزینه پایه" + ` ${currency}`}
          type="number"
          value={values.base_cost?.toString()}
          onChange={handleChange("base_cost")}
          errorMessage={errors.base_cost}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="per_weight_cost"
          label={"هزینه بر وزن" + ` ${currency}`}
          type="number"
          value={values.per_weight_cost?.toString()}
          onChange={handleChange("per_weight_cost")}
          errorMessage={errors.per_weight_cost}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="per_km_cost"
          label={"هزینه بر کیلومتر" + ` ${currency}`}
          type="number"
          value={values.per_km_cost?.toString()}
          onChange={handleChange("per_km_cost")}
          errorMessage={errors.per_km_cost}
          isDisabled={isShowMode}
        />

        <div className="mt-8">
          <SwitchWrapper
            label="وضعیت:"
            isSelected={values.is_active}
            onChange={handleChange("is_active")}
            isLoading={loading}
            isDisabled={isShowMode}
          />
        </div>
        <div className="col-span-full">
          <TextAreaCustom
            name="description"
            label="توضیحات"
            value={values.description || ""}
            onChange={handleChange("description")}
            errorMessage={errors.description}
            isDisabled={isShowMode}
          />
        </div>
      </div>

      <div className="mb-3 mt-3 flex justify-end gap-2">
        <Button
          type="button"
          className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
          variant="light"
          onPress={onClose}
        >
          {isShowMode ? "بستن" : "لغو"}
        </Button>
        {!isShowMode && (
          <Button
            type="submit"
            isLoading={loading}
            color="primary"
            className="rounded-[8px] px-10 text-[14px] font-[500] text-primary-foreground"
          >
            ذخیره
          </Button>
        )}
      </div>
    </form>
  );
}
