import { Button } from "@heroui/button";
import useSWR, { useSWRConfig } from "swr";
import { Spinner } from "@heroui/spinner";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import RetryError from "@/components/datadisplay/RetryError";
import { BrandShow, BrandsIndex } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import FileUploader from "@/components/inputs/FileUploader";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import countries from "@/constants/countries.json";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";

const TextEditorCK = dynamic(() => import("@/components/inputs/TextEditorCK"), {
  ssr: false,
});

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: BrandsIndex;
};

export default function FormBrands({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const {
    data: brandData,
    error: brandError,
    isLoading: brandLoading,
    mutate: mutateBrand,
  } = useSWR(
    isEditMode || isShowMode
      ? `admin-panel/brands/` + selectedData?.id
      : undefined,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const brand: BrandShow = brandData?.data;

  const {
    values,
    errors,
    loading,
    handleChange,
    setFieldError,
    setValues,
    handleSubmit,
    setErrors,
  } = useMyForm(
    {
      name: brand?.name,
      slug: brand?.slug,
      primary_image: undefined as undefined | string,
      country_id: brand?.country_id || undefined,
      description: brand?.description,
      content: brand?.content,
      is_active: brand?.is_active?.toString() || "1",
    },
    async (formValues) => {
      const payload =
        formValues?.slug === brand?.slug
          ? { ...formValues, slug: undefined }
          : formValues;

      const res = await apiCRUD({
        urlSuffix: `admin-panel/brands${isEditMode ? `/${selectedData?.id}` : ""}`,
        method: "POST",
        updateCacheByTag: "initials",
        data: { ...payload, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        mutate(`admin-panel/brands${filters ? "?" + filters : filters}`);
      }
    },
  );

  if (brandLoading)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (brandError) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutateBrand();
          }}
        />
      </div>
    );
  }
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
          name="slug"
          label="اسلاگ"
          value={values.slug}
          onChange={handleChange("slug")}
          errorMessage={errors.slug}
          isDisabled={isShowMode}
        />
        <SelectSearchCustom
          title="کشور"
          options={countries?.countries?.map((country) => ({
            id: country.id,
            title: country.fa_name,
          }))}
          isDisable={isShowMode}
          defaultValue={
            values?.country_id
              ? [
                  {
                    id: values?.country_id,
                    title:
                      countries?.countries?.find(
                        (country) =>
                          country.id?.toString() ===
                          values.country_id?.toString(),
                      )?.fa_name || "",
                  },
                ]
              : []
          }
          onChange={(selected) =>
            handleChange("country_id")(selected?.[0]?.id.toString())
          }
          errorMessage={errors.country_id}
          placeholder="انتخاب"
        />

        <div className="flex flex-wrap gap-2">
          <FileUploader
            trigger={
              <div className="flex items-center gap-3">
                <p>عکس:</p>
                <div className="grid h-[64px] w-[82px] place-content-center rounded-[8px] border-1">
                  <CirclePlus className="text-primary" />
                </div>
              </div>
            }
            isDisabled={isShowMode}
            onSuccess={(url) =>
              url && setValues((prev) => ({ ...prev, primary_image: url }))
            }
            onError={(val) => setFieldError("primary_image", val)}
            onFilePreview={(val) => setImagePreview(val)}
            fileType="image"
            errorMessage={errors.primary_image}
          />
          {(imagePreview || brand?.primary_image) && (
            <Image
              src={
                imagePreview
                  ? imagePreview
                  : brand.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + brand.primary_image
                    : "/images/imageplaceholder.png"
              }
              alt="category image"
              width={82}
              height={64}
              className="max-h-[64px] rounded-[8px]"
            />
          )}
        </div>
        <SwitchWrapper
          label="وضعیت:"
          onChange={handleChange("is_active")}
          isSelected={values.is_active}
          errorMessage={errors?.is_active}
          isDisabled={isShowMode}
        />
      </div>

      <div className="mt-3">
        <TextAreaCustom
          label="توضیحات:"
          name="description"
          isDisabled={isShowMode}
          value={values.description}
          onChange={(val) => handleChange("description")(val)}
          errorMessage={errors.description}
        />
      </div>
      <div className="mt-3">
        <TextEditorCK
          title="محتوا:"
          value={values.content || ""}
          disabled={isShowMode}
          setData={handleChange("content")}
          errorMessage={errors.content}
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
