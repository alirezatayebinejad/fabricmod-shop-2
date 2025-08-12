import { Button } from "@heroui/button";
import { useSWRConfig } from "swr";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import { BannerIndex } from "@/types/apiTypes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import FileUploader from "@/components/inputs/FileUploader";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: BannerIndex;
};

export default function FormBanners({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const banner: BannerIndex | undefined = selectedData;

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
      title: banner?.title,
      pre_title: banner?.pre_title,
      text: banner?.text,
      image: undefined as undefined | string,
      url: banner?.url || "",
      btn_text: banner?.btn_text,
      is_active: banner?.is_active?.toString() || "1",
      priority: banner?.priority,
      mode: banner?.mode || "",
    },
    async (formValues) => {
      const res = await apiCRUD({
        urlSuffix: `admin-panel/banners${isEditMode ? `/${selectedData?.id}` : ""}`,
        method: "POST",
        updateCacheByTag: "index",
        data: { ...formValues, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        mutate(`admin-panel/banners${filters ? "?" + filters : filters}`);
      }
    },
  );

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputBasic
          name="title"
          label="نام"
          value={values.title}
          onChange={handleChange("title")}
          errorMessage={errors.title}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="pre_title"
          label="پیش عنوان"
          value={values.pre_title ? values.pre_title : ""}
          onChange={handleChange("pre_title")}
          errorMessage={errors.pre_title}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="url"
          label="آدرس"
          value={values.url}
          onChange={handleChange("url")}
          errorMessage={errors.url}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="btn_text"
          label="نوشته دکمه"
          value={values.btn_text || ""}
          onChange={handleChange("btn_text")}
          errorMessage={errors.btn_text}
          isDisabled={isShowMode}
        />
        <InputBasic
          name="priority"
          label="اولویت"
          value={values.priority?.toString()}
          onChange={handleChange("priority")}
          errorMessage={errors.priority}
          isDisabled={isShowMode}
          type="number"
        />
        <SelectSearchCustom
          title="حالت"
          options={[
            /* for now we have no design for others */
            /* { id: "single", title: "حالت تکی" },
            { id: "two", title: "حالت دو" },
            { id: "two_half", title: "حالت دو و نیم" }, */
            { id: "three", title: "حالت سه تایی" },
            /*  { id: "four", title: "حالت چهار" }, */
            { id: "shop", title: "فروشگاه" },
            { id: "blog", title: "وبلاگ" },
            { id: "call_to_action", title: "کال تو اکشن (عکس چپ متن راست)" },
            { id: "slider", title: "اسلایدر" },
          ]}
          showNoOneOption={false}
          isSearchDisable
          isDisable={isShowMode}
          value={
            values?.mode
              ? [
                  {
                    id: values?.mode,
                    title:
                      values?.mode === "single"
                        ? "حالت تکی"
                        : values?.mode === "two"
                          ? "حالت دو"
                          : values?.mode === "two_half"
                            ? "حالت دو و نیم"
                            : values?.mode === "three"
                              ? "حالت سه تایی"
                              : values?.mode === "four"
                                ? "حالت چهار"
                                : values?.mode === "shop"
                                  ? "فروشگاه"
                                  : values?.mode === "blog"
                                    ? "وبلاگ"
                                    : values?.mode === "call_to_action"
                                      ? "کال تو اکشن (عکس چپ متن راست)"
                                      : values?.mode === "slider"
                                        ? "اسلایدر"
                                        : "",
                  },
                ]
              : []
          }
          onChange={(selected) =>
            setValues((prev) => ({
              ...prev,
              mode: selected?.[0]?.id.toString(),
            }))
          }
          errorMessage={errors.mode}
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
              url && setValues((prev) => ({ ...prev, image: url }))
            }
            onError={(val) => setFieldError("image", val)}
            onFilePreview={(val) => setImagePreview(val)}
            fileType="image"
            errorMessage={errors.image}
          />
          {(imagePreview || banner?.image) && (
            <Image
              src={
                imagePreview
                  ? imagePreview
                  : banner?.image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + banner?.image
                    : "/images/imageplaceholder.png"
              }
              alt="category image"
              width={82}
              height={64}
              className="h-[64px] rounded-[8px]"
            />
          )}
        </div>
      </div>

      <div className="mt-3">
        <TextAreaCustom
          label="توضیحات:"
          name="text"
          isDisabled={isShowMode}
          value={values.text ? values.text : undefined}
          onChange={(val) => handleChange("text")(val)}
          errorMessage={errors.text}
        />
      </div>
      <div className="mt-3">
        <SwitchWrapper
          label="وضعیت:"
          onChange={handleChange("is_active")}
          isSelected={values.is_active}
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
