import { Button } from "@heroui/button";
import { mutate } from "swr";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import { Attributes } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: Attributes;
};

export default function FormAttributes({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const { filters } = useFiltersContext();

  const attributes: Attributes | undefined = selectedData;

  const { values, errors, loading, handleChange, handleSubmit, setErrors } =
    useMyForm(
      {
        name: attributes?.name,
        slug: attributes?.slug,
        is_active: attributes?.is_active?.toString() || "1",
        is_filter: attributes?.is_filter?.toString() || "1",
      },
      async (formValues) => {
        const payload =
          formValues?.slug === attributes?.slug
            ? { ...formValues, slug: undefined }
            : formValues;
        const res = await apiCRUD({
          urlSuffix: `admin-panel/attributes${isEditMode ? `/${selectedData?.id}` : ""}`,
          method: "POST",
          data: { ...payload, _method: isEditMode ? "put" : "post" },
        });
        if (res?.message) setErrors(res.message);
        if (res?.status === "success") {
          onClose();
          mutate(`admin-panel/attributes${filters ? "?" + filters : filters}`);
        }
      },
    );

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBasic
          name="name"
          label="نام"
          placeholder=" "
          value={values.name}
          onChange={handleChange("name")}
          errorMessage={errors.name}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="slug"
          label="اسلاگ (اختیاری)"
          placeholder=" "
          value={values.slug}
          onChange={handleChange("slug")}
          errorMessage={errors.slug}
          isDisabled={isShowMode}
        />
        <SwitchWrapper
          label="فیلتر:"
          onChange={handleChange("is_filter")}
          isSelected={values.is_filter === "1"}
          errorMessage={errors?.is_filter}
          isDisabled={isShowMode}
        />
        <SwitchWrapper
          label="وضعیت:"
          onChange={handleChange("is_active")}
          isSelected={values.is_active === "1"}
          errorMessage={errors?.is_active}
          isDisabled={isShowMode}
        />
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
