import { Button } from "@heroui/button";
import { useSWRConfig } from "swr";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import { CouponIndex, CouponShow } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import DatePickerWrapper from "@/components/inputs/DatePickerWrapper";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: CouponIndex;
};

export default function FormCoupons({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();

  const coupon: CouponShow | undefined = selectedData;

  const { values, errors, loading, handleChange, handleSubmit, setErrors } =
    useMyForm(
      {
        name: coupon?.name,
        type: coupon?.type,
        code: coupon?.code,
        value: coupon?.value,
        max_amount: coupon?.max_amount,
        expire_at: coupon?.expire_at,
        description: coupon?.description,
        is_multi: coupon?.is_multi,
      },
      async (formValues) => {
        const res = await apiCRUD({
          urlSuffix: `admin-panel/coupons${isEditMode ? `/${selectedData?.id}` : ""}`,
          method: "POST",
          data: { ...formValues, _method: isEditMode ? "put" : "post" },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose();
          mutate(`admin-panel/coupons${filters ? "?" + filters : filters}`);
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
        <SelectSearchCustom
          options={[
            { id: "amount", title: "مقدار" },
            { id: "percentage", title: "درصد" },
          ]}
          value={
            values.type
              ? [
                  {
                    id: values.type,
                    title: values.type === "amount" ? "مقدار" : "درصد",
                  },
                ]
              : []
          }
          onChange={(selected) =>
            handleChange("type")(selected[0]?.id?.toString())
          }
          isDisable={isShowMode}
          title="نوع"
          errorMessage={errors.type}
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
          name="value"
          label="مقدار"
          type="number"
          value={values.value?.toString()}
          onChange={handleChange("value")}
          errorMessage={errors.value}
          isDisabled={isShowMode}
        />
        {values.type === "percentage" && (
          <InputBasic
            name="max_amount"
            label="حداکثر مقدار"
            type="number"
            value={values.max_amount?.toString()}
            onChange={handleChange("max_amount")}
            errorMessage={errors.max_amount}
            isDisabled={isShowMode}
          />
        )}
        <DatePickerWrapper
          name="expire_at"
          title="تاریخ انقضا"
          defaultValue={values.expire_at}
          onChange={(e) =>
            e ? handleChange("expire_at")(e) : handleChange("expire_at")("")
          }
          isDisabled={isShowMode}
          errorMessage={errors.expire_at}
        />
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
        <div className="mt-8">
          <SwitchWrapper
            label="چند بار مصرف:"
            isSelected={values.is_multi?.toString() === "1"}
            onChange={(selected) =>
              handleChange("is_multi")(selected === "1" ? "1" : "0")
            }
            isLoading={loading}
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
